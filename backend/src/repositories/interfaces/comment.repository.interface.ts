import type { ICommentRecord } from '../../interfaces/comment.interface.js';
import type { ObjectId } from '../../types/domain.types.js';
import type { CommentListOptions, ICommentPopulated } from '../types/comment.repository.types.js';
import type { RepositoryCreateInput, RepositoryUpdateInput } from '../types/repository.types.js';

export interface ICommentRepository {
  create(data: RepositoryCreateInput<ICommentRecord>): Promise<ICommentRecord>;
  findById(id: string | ObjectId): Promise<ICommentRecord | null>;
  updateById(
    id: string | ObjectId,
    data: RepositoryUpdateInput<ICommentRecord>,
  ): Promise<ICommentRecord | null>;
  findByTicketId(
    ticketId: string | ObjectId,
    options?: CommentListOptions,
  ): Promise<ICommentPopulated[]>;
  deleteById(id: string | ObjectId): Promise<boolean>;
  deleteByTicketId(ticketId: string | ObjectId): Promise<number>;
  countByTicketId(ticketId: string | ObjectId): Promise<number>;
}
