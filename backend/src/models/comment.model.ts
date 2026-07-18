import mongoose, { Schema, model, type HydratedDocument, type Model } from 'mongoose';

import { COLLECTIONS } from '../constants/collection.constants.js';
import { applySchemaIndexes } from '../database/apply-indexes.js';
import type { ICommentRecord } from '../interfaces/comment.interface.js';

export type CommentDocument = HydratedDocument<ICommentRecord>;

const commentSchema = new Schema(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: COLLECTIONS.TICKETS,
      required: [true, 'ticketId is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: COLLECTIONS.USERS,
      required: [true, 'createdBy is required'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: COLLECTIONS.COMMENTS,
  },
);

applySchemaIndexes(commentSchema, COLLECTIONS.COMMENTS);

export const Comment = (
  (mongoose.models[COLLECTIONS.COMMENTS] as Model<CommentDocument> | undefined) ??
  model(COLLECTIONS.COMMENTS, commentSchema)
) as Model<CommentDocument>;
