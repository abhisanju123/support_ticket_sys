export { BaseService } from './base/index.js';
export { CommentService } from './comment/index.js';
export { DashboardStatisticsService } from './dashboard/index.js';
export {
  TicketCreationService,
  TicketDeletionService,
  TicketRetrievalService,
  TicketSearchFilterService,
  TicketStatusService,
  TicketUpdateService,
  ALLOWED_TICKET_STATUS_TRANSITIONS,
  isAllowedTicketStatusTransition,
} from './ticket/index.js';
export type {
  CreateCommentInput,
  CreateTicketInput,
  DashboardStatistics,
  TicketFilterQuery,
  TicketListQuery,
  TicketSearchQuery,
  UpdateTicketInput,
} from './types/index.js';
