import { isValidObjectId, Types, type PipelineStage, type QueryFilter } from 'mongoose';

import { getNextTicketNumber } from '../database/ticket-number.js';
import { TicketStatus } from '../enums/ticket-status.enum.js';
import type { ITicketRecord } from '../interfaces/ticket.interface.js';
import type { ObjectId } from '../types/domain.types.js';
import { Ticket } from '../models/ticket.model.js';
import { BaseRepository } from './base/base.repository.js';
import type { ITicketRepository } from './interfaces/ticket.repository.interface.js';
import type { DashboardStatusCounts } from './types/dashboard.repository.types.js';
import type {
  ITicketPopulated,
  TicketListOptions,
  TicketQueryOptions,
} from './types/ticket.repository.types.js';
import type { RepositoryCreateInput } from './types/repository.types.js';

const USER_POPULATE_FIELDS = 'name email role';
const DEFAULT_SORT = { ticketNumber: 1 } as const;

export class TicketRepository extends BaseRepository<ITicketRecord> implements ITicketRepository {
  constructor() {
    super(Ticket, 'Ticket');
  }

  override async create(
    data: Omit<RepositoryCreateInput<ITicketRecord>, 'ticketNumber'>,
  ): Promise<ITicketRecord> {
    const ticketNumber = await getNextTicketNumber();

    return super.create({
      ...data,
      ticketNumber,
    });
  }

  async findByIdWithUsers(id: string | ObjectId): Promise<ITicketPopulated | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    try {
      const document = await this.model
        .findById(id)
        .populate('createdBy', USER_POPULATE_FIELDS)
        .populate('assignedTo', USER_POPULATE_FIELDS)
        .lean<ITicketPopulated>()
        .exec();

      return document ?? null;
    } catch (error) {
      throw this.handleError(error, 'findByIdWithUsers');
    }
  }

  async findByTicketNumber(ticketNumber: number): Promise<ITicketRecord | null> {
    try {
      const document = await this.model
        .findOne({ ticketNumber })
        .lean<ITicketRecord>()
        .exec();

      return document ?? null;
    } catch (error) {
      throw this.handleError(error, 'findByTicketNumber');
    }
  }

  async findByTicketNumberWithUsers(ticketNumber: number): Promise<ITicketPopulated | null> {
    try {
      const document = await this.model
        .findOne({ ticketNumber })
        .populate('createdBy', USER_POPULATE_FIELDS)
        .populate('assignedTo', USER_POPULATE_FIELDS)
        .lean<ITicketPopulated>()
        .exec();

      return document ?? null;
    } catch (error) {
      throw this.handleError(error, 'findByTicketNumberWithUsers');
    }
  }

  async list(options: TicketListOptions = {}): Promise<ITicketRecord[]> {
    return this.executeListQuery(options, false);
  }

  async listWithUsers(options: TicketListOptions = {}): Promise<ITicketPopulated[]> {
    return this.executeListQuery(options, true);
  }

  async searchByKeyword(
    keyword: string,
    options: Omit<TicketListOptions, 'keyword'> = {},
  ): Promise<ITicketRecord[]> {
    return this.list({ ...options, keyword });
  }

  async findByStatus(
    status: TicketStatus,
    options: Omit<TicketListOptions, 'status'> = {},
  ): Promise<ITicketRecord[]> {
    return this.list({ ...options, status });
  }

  async countTickets(options: TicketQueryOptions = {}): Promise<number> {
    return this.count(this.buildFilter(options) as QueryFilter<ITicketRecord>);
  }

  async aggregateStatusCounts(accessibleToUserId?: string | ObjectId): Promise<DashboardStatusCounts> {
    try {
      const pipeline: PipelineStage[] = [];

      if (accessibleToUserId) {
        const scopeUserId = this.toScopeObjectId(accessibleToUserId);
        pipeline.push({
          $match: {
            $or: [{ createdBy: scopeUserId }, { assignedTo: scopeUserId }],
          },
        });
      }

      pipeline.push({ $group: { _id: '$status', count: { $sum: 1 } } });

      const grouped = await this.model.aggregate<{ _id: TicketStatus; count: number }>(pipeline);

      const counts: DashboardStatusCounts = {
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
        cancelled: 0,
      };

      for (const row of grouped) {
        counts.total += row.count;

        switch (row._id) {
          case TicketStatus.OPEN:
            counts.open = row.count;
            break;
          case TicketStatus.IN_PROGRESS:
            counts.inProgress = row.count;
            break;
          case TicketStatus.RESOLVED:
            counts.resolved = row.count;
            break;
          case TicketStatus.CLOSED:
            counts.closed = row.count;
            break;
          case TicketStatus.CANCELLED:
            counts.cancelled = row.count;
            break;
          default:
            break;
        }
      }

      return counts;
    } catch (error) {
      throw this.handleError(error, 'aggregateStatusCounts');
    }
  }

  private async executeListQuery(
    options: TicketListOptions,
    populateUsers: false,
  ): Promise<ITicketRecord[]>;
  private async executeListQuery(
    options: TicketListOptions,
    populateUsers: true,
  ): Promise<ITicketPopulated[]>;
  private async executeListQuery(
    options: TicketListOptions,
    populateUsers: boolean,
  ): Promise<ITicketRecord[] | ITicketPopulated[]> {
    const { sort = DEFAULT_SORT, skip, limit, projection, ...queryOptions } = options;

    try {
      let query = this.model.find(this.buildFilter(queryOptions) as QueryFilter<ITicketRecord>);

      if (projection) {
        query = query.select(projection);
      }

      query = query.sort(sort);

      if (skip !== undefined) {
        query = query.skip(skip);
      }

      if (limit !== undefined) {
        query = query.limit(limit);
      }

      if (populateUsers) {
        query = query
          .populate('createdBy', USER_POPULATE_FIELDS)
          .populate('assignedTo', USER_POPULATE_FIELDS);
      }

      if (populateUsers) {
        return await query.lean<ITicketPopulated[]>().exec();
      }

      return await query.lean<ITicketRecord[]>().exec();
    } catch (error) {
      throw this.handleError(error, populateUsers ? 'listWithUsers' : 'list');
    }
  }

  private buildFilter(options: TicketQueryOptions = {}): Record<string, unknown> {
    const {
      filter = {},
      status,
      priority,
      createdBy,
      assignedTo,
      accessibleToUserId,
      keyword,
      keywordOr,
    } = options;
    const mongoFilter: Record<string, unknown> = { ...filter };
    const andClauses: Record<string, unknown>[] = [];

    if (status) {
      mongoFilter.status = status;
    }

    if (priority) {
      mongoFilter.priority = priority;
    }

    if (createdBy) {
      mongoFilter.createdBy = createdBy;
    }

    if (assignedTo) {
      mongoFilter.assignedTo = assignedTo;
    }

    if (accessibleToUserId) {
      const scopeUserId = this.toScopeObjectId(accessibleToUserId);
      andClauses.push({
        $or: [{ createdBy: scopeUserId }, { assignedTo: scopeUserId }],
      });
    }

    if (keywordOr?.length) {
      andClauses.push({ $or: keywordOr });
    } else if (keyword?.trim()) {
      const regex = new RegExp(this.escapeRegex(keyword.trim()), 'i');
      andClauses.push({ $or: [{ title: regex }, { description: regex }] });
    }

    if (andClauses.length === 1) {
      Object.assign(mongoFilter, andClauses[0]);
    } else if (andClauses.length > 1) {
      mongoFilter.$and = andClauses;
    }

    return mongoFilter;
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private toScopeObjectId(id: string | ObjectId): Types.ObjectId {
    if (id instanceof Types.ObjectId) {
      return id;
    }

    if (!isValidObjectId(id)) {
      throw new Error('Invalid user scope identifier');
    }

    return new Types.ObjectId(id);
  }
}
