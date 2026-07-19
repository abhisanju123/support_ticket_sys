import type { Router } from 'express';

import { createAppControllers } from '../container.js';
import { createAuthenticateMiddleware } from '../middlewares/authenticate.middleware.js';

import { createAuthRouter } from './auth.routes.js';
import { createNotificationRouter } from './notification.routes.js';
import { createTicketRouter } from './ticket.routes.js';
import { createUserRouter } from './user.routes.js';

export const registerRoutes = (router: Router): void => {
  const {
    authController,
    authService,
    ticketController,
    commentController,
    userController,
    notificationController,
  } = createAppControllers();
  const authenticate = createAuthenticateMiddleware(authService);

  router.use('/auth', createAuthRouter(authController, authService));
  router.use('/users', authenticate, createUserRouter(userController));
  router.use('/notifications', authenticate, createNotificationRouter(notificationController));
  router.use('/tickets', authenticate, createTicketRouter(ticketController, commentController));
};
