import type { ObjectId } from '../types/domain.types.js';

/** Core comment fields stored in MongoDB. */
export interface IComment {
  ticketId: ObjectId;
  message: string;
  createdBy: ObjectId;
}

/** Full persisted comment document including id and timestamps. */
export interface ICommentRecord extends IComment {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
