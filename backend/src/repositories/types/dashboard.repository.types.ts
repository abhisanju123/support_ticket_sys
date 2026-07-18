import type { TicketStatus } from '../../enums/ticket-status.enum.js';

export interface StatusCountAggregate {
  _id: TicketStatus;
  count: number;
}

export interface DashboardStatusCounts {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  cancelled: number;
}
