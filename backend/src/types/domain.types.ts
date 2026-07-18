import type { Types } from 'mongoose';

export type ObjectId = Types.ObjectId;

export interface BaseDocument {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
