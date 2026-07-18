import type { TicketStatus } from '../../enums/ticket-status.enum.js';
import type { TicketListQuery } from '../../services/types/index.js';

export interface ChangeTicketStatusBody {
  status: TicketStatus;
}

export interface TicketListRequestQuery extends TicketListQuery {
  keyword?: string;
  status?: TicketStatus;
}

export type TicketListQueryParams = TicketListQuery;
