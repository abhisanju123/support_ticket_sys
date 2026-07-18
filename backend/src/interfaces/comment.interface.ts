import type { ObjectId } from '../types/domain.types.js';

/** Core comment fields stored in MongoDB. */
export interface IComment {
  ticketId: ObjectId;
  message: string;
  createdBy: ObjectId;
}

/** Full persisted comment document including id and creation timestamp. */
export interface ICommentRecord extends IComment {
  _id: ObjectId;
  createdAt: Date;
}
