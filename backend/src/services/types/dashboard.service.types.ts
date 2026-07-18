import type { TicketStatus } from '../../enums/ticket-status.enum.js';
import type { TicketListQuery } from './ticket.service.types.js';

export interface TicketSearchQuery extends TicketListQuery {
  keyword: string;
}

export interface TicketFilterQuery extends TicketListQuery {
  status: TicketStatus;
}

export interface TicketListFilterQuery extends TicketListQuery {
  keyword?: string;
  status?: TicketStatus;
}

export interface DashboardStatistics {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  cancelled: number;
}
