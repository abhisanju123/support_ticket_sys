import type { Request, Response } from 'express';

import {
  ApiResponse,
  getAuthenticatedUser,
  getTicketNumberParam,
  getValidatedBody,
  getValidatedQuery,
} from '../../helpers/index.js';
import { asyncHandler } from '../../middlewares/index.js';
import type { CommentService } from '../../services/comment/comment.service.js';
import type { CreateCommentInput } from '../../services/types/index.js';
import type { CommentListQueryParams, CreateCommentBody } from '../types/comment.controller.types.js';

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
}
