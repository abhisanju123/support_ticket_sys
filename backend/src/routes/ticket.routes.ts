import { Router } from 'express';

import type { CommentController } from '../controllers/comment/comment.controller.js';
import type { TicketController } from '../controllers/ticket/ticket.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  changeTicketStatusBodySchema,
  commentListQuerySchema,
  createCommentBodySchema,
  createTicketBodySchema,
  ticketCommentParamSchema,
  ticketIdParamSchema,
  ticketListQuerySchema,
  updateTicketBodySchema,
} from '../schemas/request/index.js';

export const createTicketRouter = (
  ticketController: TicketController,
  commentController: CommentController,
): Router => {
  const router = Router();

  router.get('/dashboard', ticketController.getDashboardStatistics);

  router.get('/', validate({ query: ticketListQuerySchema }), ticketController.listTickets);

  router.post('/', validate({ body: createTicketBodySchema }), ticketController.createTicket);

  router.get(
    '/:id',
    validate({ params: ticketIdParamSchema }),
    ticketController.getTicketById,
  );

  router.put(
    '/:id',
    validate({ params: ticketIdParamSchema, body: updateTicketBodySchema }),
    ticketController.updateTicket,
  );

  router.patch(
    '/:id/status',
    validate({ params: ticketIdParamSchema, body: changeTicketStatusBodySchema }),
    ticketController.changeTicketStatus,
  );

  router.delete(
    '/:id',
    validate({ params: ticketIdParamSchema }),
    ticketController.deleteTicket,
  );

  router.post(
    '/:ticketId/comments',
    validate({ params: ticketCommentParamSchema, body: createCommentBodySchema }),
    commentController.addComment,
  );

  router.get(
    '/:ticketId/comments',
    validate({ params: ticketCommentParamSchema, query: commentListQuerySchema }),
    commentController.getCommentsByTicket,
  );

  return router;
};
