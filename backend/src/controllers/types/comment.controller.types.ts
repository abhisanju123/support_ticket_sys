import type { CommentListOptions } from '../../repositories/types/comment.repository.types.js';

export interface CreateCommentBody {
  message: string;
  createdBy: string;
}

export interface UpdateCommentBody {
  message: string;
}

export type CommentListQueryParams = CommentListOptions;
