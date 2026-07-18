import { TICKET_STATUSES } from '../../enums/ticket-status.enum.js';
import type { ITicketPopulated } from '../../repositories/types/ticket.repository.types.js';
import type { ITicketRepository } from '../../repositories/interfaces/ticket.repository.interface.js';
import { ValidationException } from '../../exceptions/index.js';
import { BaseService } from '../base/base.service.js';
import type { TicketFilterQuery, TicketListFilterQuery, TicketSearchQuery } from '../types/dashboard.service.types.js';

const DEFAULT_SORT = { ticketNumber: 1 } as const;

export class TicketSearchFilterService extends BaseService {
  constructor(private readonly ticketRepository: ITicketRepository) {
    super();
  }

  async searchByKeyword(query: TicketSearchQuery): Promise<ITicketPopulated[]> {
    const keyword = query.keyword?.trim();

    if (!keyword) {
      throw new ValidationException('Search keyword is required');
    }

    const { skip, limit, sort = DEFAULT_SORT } = query;

    return this.ticketRepository.listWithUsers({
      keyword,
      skip,
      limit,
      sort,
    });
  }

  async filterByStatus(query: TicketFilterQuery): Promise<ITicketPopulated[]> {
    if (!TICKET_STATUSES.includes(query.status)) {
      throw new ValidationException('Invalid ticket status');
    }

    const { status, skip, limit, sort = DEFAULT_SORT } = query;

    return this.ticketRepository.listWithUsers({
      status,
      skip,
      limit,
      sort,
    });
  }

  async listWithFilters(query: TicketListFilterQuery): Promise<ITicketPopulated[]> {
    const keyword = query.keyword?.trim();
    const { status, skip, limit, sort = DEFAULT_SORT } = query;

    if (status && !TICKET_STATUSES.includes(status)) {
      throw new ValidationException('Invalid ticket status');
    }

    if (!keyword && !status) {
      throw new ValidationException('Provide a search keyword and/or status filter');
    }

    return this.ticketRepository.listWithUsers({
      ...(keyword ? { keyword } : {}),
      ...(status ? { status } : {}),
      skip,
      limit,
      sort,
    });
  }
}
