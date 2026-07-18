import { isValidObjectId, type QueryFilter } from 'mongoose';

import type { ICommentRecord } from '../interfaces/comment.interface.js';
import type { ObjectId } from '../types/domain.types.js';
import { Comment } from '../models/comment.model.js';
import { BaseRepository } from './base/base.repository.js';
import type { ICommentRepository } from './interfaces/comment.repository.interface.js';
import type {
  CommentListOptions,
  ICommentPopulated,
} from './types/comment.repository.types.js';

const USER_POPULATE_FIELDS = 'name email role';
const DEFAULT_THREAD_SORT = { createdAt: 1 } as const;

export class CommentRepository
  extends BaseRepository<ICommentRecord>
  implements ICommentRepository
{
  constructor() {
    super(Comment, 'Comment');
  }

  async findByTicketId(
    ticketId: string | ObjectId,
    options: CommentListOptions = {},
  ): Promise<ICommentPopulated[]> {
    if (!isValidObjectId(ticketId)) {
      return [];
    }

    const { sort = DEFAULT_THREAD_SORT, skip, limit, projection } = options;

    try {
      let query = this.model.find({ ticketId } as QueryFilter<ICommentRecord>);

      if (projection) {
        query = query.select(projection);
      }

      query = query.sort(sort).populate('createdBy', USER_POPULATE_FIELDS);

      if (skip !== undefined) {
        query = query.skip(skip);
      }

      if (limit !== undefined) {
        query = query.limit(limit);
      }

      const documents = await query.lean<ICommentPopulated[]>().exec();
      return documents;
    } catch (error) {
      throw this.handleError(error, 'findByTicketId');
    }
  }

  async countByTicketId(ticketId: string | ObjectId): Promise<number> {
    if (!isValidObjectId(ticketId)) {
      return 0;
    }

    return this.count({ ticketId } as QueryFilter<ICommentRecord>);
  }

  async deleteByTicketId(ticketId: string | ObjectId): Promise<number> {
    if (!isValidObjectId(ticketId)) {
      return 0;
    }

    try {
      const result = await this.model.deleteMany({ ticketId }).exec();
      return result.deletedCount ?? 0;
    } catch (error) {
      throw this.handleError(error, 'deleteByTicketId');
    }
  }
}
