import type { ObjectId } from '../../types/domain.types.js';

export interface CreateCommentInput {
  ticketNumber: number;
  message: string;
  createdBy: string | ObjectId;
}
