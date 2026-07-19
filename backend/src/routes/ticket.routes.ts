import { Router } from 'express';

import type { CommentController } from '../controllers/comment/comment.controller.js';
import type { TicketController } from '../controllers/ticket/ticket.controller.js';
import { Permission } from '../enums/permission.enum.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  changeTicketStatusBodySchema,
  commentListQuerySchema,
  createCommentBodySchema,
  createTicketBodySchema,
  ticketCommentIdParamSchema,
  ticketCommentParamSchema,
  ticketIdParamSchema,
  ticketListQuerySchema,
  updateCommentBodySchema,
  updateTicketBodySchema,
} from '../schemas/request/index.js';

export const createTicketRouter = (
  ticketController: TicketController,
  commentController: CommentController,
): Router => {
  const router = Router();

  router.get(
    '/dashboard',
    authorize(Permission.DASHBOARD_VIEW),
    ticketController.getDashboardStatistics,
  );

  router.get(
    '/',
    authorize(Permission.TICKET_VIEW),
    validate({ query: ticketListQuerySchema }),
    ticketController.listTickets,
  );

  router.post(
    '/',
    authorize(Permission.TICKET_CREATE),
    validate({ body: createTicketBodySchema }),
    ticketController.createTicket,
  );

  router.get(
    '/:id',
    authorize(Permission.TICKET_VIEW),
    validate({ params: ticketIdParamSchema }),
    ticketController.getTicketById,
  );

  router.put(
    '/:id',
    authorize(Permission.TICKET_EDIT),
    validate({ params: ticketIdParamSchema, body: updateTicketBodySchema }),
    ticketController.updateTicket,
  );

  router.patch(
    '/:id/status',
    authorize(Permission.TICKET_CHANGE_STATUS),
    validate({ params: ticketIdParamSchema, body: changeTicketStatusBodySchema }),
    ticketController.changeTicketStatus,
  );

  router.delete(
    '/:id',
    authorize(Permission.TICKET_DELETE),
    validate({ params: ticketIdParamSchema }),
    ticketController.deleteTicket,
  );

  router.post(
    '/:ticketId/comments',
    authorize(Permission.COMMENT_CREATE),
    validate({ params: ticketCommentParamSchema, body: createCommentBodySchema }),
    commentController.addComment,
  );

  router.get(
    '/:ticketId/comments',
    authorize(Permission.COMMENT_VIEW),
    validate({ params: ticketCommentParamSchema, query: commentListQuerySchema }),
    commentController.getCommentsByTicket,
  );

  router.patch(
    '/:ticketId/comments/:commentId',
    authorize(Permission.COMMENT_CREATE),
    validate({
      params: ticketCommentIdParamSchema,
      body: updateCommentBodySchema,
    }),
    commentController.updateComment,
  );

  router.delete(
    '/:ticketId/comments/:commentId',
    authorize(Permission.COMMENT_CREATE),
    validate({ params: ticketCommentIdParamSchema }),
    commentController.deleteComment,
  );

  return router;
};
