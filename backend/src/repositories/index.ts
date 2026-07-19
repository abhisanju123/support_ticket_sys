export { BaseRepository } from './base/index.js';
export { RepositoryError } from './errors/index.js';
export type {
  ICommentRepository,
  INotificationRepository,
  ITicketRepository,
  IUserRepository,
} from './interfaces/index.js';
export type {
  CommentListOptions,
  DashboardStatusCounts,
  FindAllOptions,
  ITicketPopulated,
  PaginatedResult,
  PopulatedUserSummary,
  RepositoryCreateInput,
  RepositoryUpdateInput,
  TicketListOptions,
  TicketQueryOptions,
} from './types/index.js';
export { CommentRepository } from './comment.repository.js';
export { NotificationRepository } from './notification.repository.js';
export { TicketRepository } from './ticket.repository.js';
export { UserRepository } from './user.repository.js';
