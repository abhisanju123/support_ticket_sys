import type { ICommentRecord } from '../../interfaces/comment.interface.js';
import type { FindAllOptions } from './repository.types.js';
import type { PopulatedUserSummary } from './ticket.repository.types.js';

export interface CommentListOptions
  extends Pick<FindAllOptions, 'sort' | 'skip' | 'limit' | 'projection'> {}

export interface ICommentPopulated extends Omit<ICommentRecord, 'createdBy'> {
  createdBy: PopulatedUserSummary;
}
