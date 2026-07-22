import type { Request, Response } from 'express';

import {
  ApiResponse,
  getAuthenticatedUser,
  getRouteParam,
  getTicketNumberParam,
  getValidatedBody,
  getValidatedQuery,
} from '../../helpers/index.js';
import { asyncHandler } from '../../middlewares/index.js';
import type { CommentListOptions } from '../../repositories/types/comment.repository.types.js';
import type { CommentService } from '../../services/comment/comment.service.js';
import type { CreateCommentInput } from '../../services/comment/comment.service.js';

export interface CreateCommentBody {
  message: string;
  createdBy: string;
}

export interface UpdateCommentBody {
  message: string;
}

export type CommentListQueryParams = CommentListOptions;

export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  addComment = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const { message, createdBy } = getValidatedBody<CreateCommentBody>(req);

    const comment = await this.commentService.createComment(
      {
        ticketNumber: getTicketNumberParam(req, 'ticketId'),
        message,
        createdBy,
      } satisfies CreateCommentInput,
      user,
    );

    ApiResponse.created(res, comment, 'Comment added successfully');
  });

  getCommentsByTicket = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const comments = await this.commentService.getCommentsByTicket(
      getTicketNumberParam(req, 'ticketId'),
      user,
      getValidatedQuery<CommentListQueryParams>(req),
    );

    ApiResponse.success(res, comments, 'Comments retrieved successfully');
  });

  updateComment = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const { message } = getValidatedBody<UpdateCommentBody>(req);

    const comment = await this.commentService.updateComment(
      {
        ticketNumber: getTicketNumberParam(req, 'ticketId'),
        commentId: getRouteParam(req, 'commentId'),
        message,
      },
      user,
    );

    ApiResponse.success(res, comment, 'Comment updated successfully');
  });

  deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);

    await this.commentService.deleteComment(
      {
        ticketNumber: getTicketNumberParam(req, 'ticketId'),
        commentId: getRouteParam(req, 'commentId'),
      },
      user,
    );

    ApiResponse.success(res, null, 'Comment deleted successfully');
  });
}
