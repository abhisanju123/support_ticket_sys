import { CommentRepository, TicketRepository, UserRepository } from './repositories/index.js';
import { AuthController } from './controllers/auth/auth.controller.js';
import { CommentController, TicketController, UserController } from './controllers/index.js';
import { CommentService } from './services/comment/comment.service.js';
import { AuthService } from './services/auth/auth.service.js';
import { DashboardStatisticsService } from './services/dashboard/dashboard-statistics.service.js';
import { TicketDeletionService } from './services/ticket/ticket-deletion.service.js';
import { TicketCreationService } from './services/ticket/ticket-creation.service.js';
import { TicketRetrievalService } from './services/ticket/ticket-retrieval.service.js';
import { TicketSearchFilterService } from './services/ticket/ticket-search-filter.service.js';
import { TicketStatusService } from './services/ticket/ticket-status.service.js';
import { TicketUpdateService } from './services/ticket/ticket-update.service.js';

export interface AppControllers {
  authController: AuthController;
  ticketController: TicketController;
  commentController: CommentController;
  userController: UserController;
}

export interface AppServices {
  authService: AuthService;
}

export interface AppContainer extends AppControllers, AppServices {}

export const createAppControllers = (): AppContainer => {
  const ticketRepository = new TicketRepository();
  const userRepository = new UserRepository();
  const commentRepository = new CommentRepository();

  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);

  const ticketCreationService = new TicketCreationService(ticketRepository, userRepository);
  const ticketRetrievalService = new TicketRetrievalService(ticketRepository);
  const ticketUpdateService = new TicketUpdateService(ticketRepository, userRepository);
  const ticketDeletionService = new TicketDeletionService(ticketRepository, commentRepository);
  const ticketStatusService = new TicketStatusService(ticketRepository);
  const ticketSearchFilterService = new TicketSearchFilterService(ticketRepository);
  const dashboardStatisticsService = new DashboardStatisticsService(ticketRepository);
  const commentService = new CommentService(
    commentRepository,
    ticketRepository,
    userRepository,
  );

  const ticketController = new TicketController(
    ticketCreationService,
    ticketRetrievalService,
    ticketUpdateService,
    ticketDeletionService,
    ticketStatusService,
    ticketSearchFilterService,
    dashboardStatisticsService,
  );

  const commentController = new CommentController(commentService);
  const userController = new UserController(userRepository);

  return {
    authController,
    authService,
    ticketController,
    commentController,
    userController,
  };
};
