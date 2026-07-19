import type { ITicketRecord } from '../../interfaces/ticket.interface.js';
import type { ObjectId } from '../../types/domain.types.js';
import type { TicketStatus } from '../../enums/ticket-status.enum.js';
import type {
  ITicketPopulated,
  TicketListOptions,
  TicketQueryOptions,
} from '../types/ticket.repository.types.js';
import type { DashboardStatusCounts } from '../types/dashboard.repository.types.js';
import type {
  RepositoryCreateInput,
  RepositoryUpdateInput,
} from '../types/repository.types.js';

export interface ITicketRepository {
  create(data: Omit<RepositoryCreateInput<ITicketRecord>, 'ticketNumber'>): Promise<ITicketRecord>;
  findById(id: string | ObjectId): Promise<ITicketRecord | null>;
  findByIdWithUsers(id: string | ObjectId): Promise<ITicketPopulated | null>;
  findByTicketNumber(ticketNumber: number): Promise<ITicketRecord | null>;
  findByTicketNumberWithUsers(ticketNumber: number): Promise<ITicketPopulated | null>;
  updateById(
    id: string | ObjectId,
    data: RepositoryUpdateInput<ITicketRecord>,
  ): Promise<ITicketRecord | null>;
  deleteById(id: string | ObjectId): Promise<boolean>;
  list(options?: TicketListOptions): Promise<ITicketRecord[]>;
  listWithUsers(options?: TicketListOptions): Promise<ITicketPopulated[]>;
  searchByKeyword(
    keyword: string,
    options?: Omit<TicketListOptions, 'keyword'>,
  ): Promise<ITicketRecord[]>;
  findByStatus(
    status: TicketStatus,
    options?: Omit<TicketListOptions, 'status'>,
  ): Promise<ITicketRecord[]>;
  countTickets(options?: TicketQueryOptions): Promise<number>;
  aggregateStatusCounts(accessibleToUserId?: string | ObjectId): Promise<DashboardStatusCounts>;
}
