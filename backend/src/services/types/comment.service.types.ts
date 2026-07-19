import type { ObjectId } from '../../types/domain.types.js';

export interface CreateCommentInput {
  ticketNumber: number;
  message: string;
  createdBy: string | ObjectId;
}

export interface UpdateCommentInput {
  ticketNumber: number;
  commentId: string;
  message: string;
}

export interface DeleteCommentInput {
  ticketNumber: number;
  commentId: string;
}
