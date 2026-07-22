export { BaseService } from './base/base.service.js';
export { CommentService } from './comment/comment.service.js';
export { DashboardStatisticsService } from './dashboard/dashboard-statistics.service.js';
export { TicketCreationService } from './ticket/ticket-creation.service.js';
export { TicketDeletionService } from './ticket/ticket-deletion.service.js';
export { TicketRetrievalService } from './ticket/ticket-retrieval.service.js';
export { TicketSearchFilterService } from './ticket/ticket-search-filter.service.js';
export { TicketStatusService } from './ticket/ticket-status.service.js';
export { TicketUpdateService } from './ticket/ticket-update.service.js';
export {
  ALLOWED_TICKET_STATUS_TRANSITIONS,
  isAllowedTicketStatusTransition,
} from './ticket/ticket-status-transitions.js';
export type {
  CreateCommentInput,
  DeleteCommentInput,
  UpdateCommentInput,
} from './comment/comment.service.js';
export type {
  DashboardStatistics,
  TicketFilterQuery,
  TicketListFilterQuery,
  TicketSearchQuery,
} from './types/dashboard.service.types.js';
export type {
  CreateTicketInput,
  TicketListQuery,
  UpdateTicketInput,
} from './types/ticket.service.types.js';
