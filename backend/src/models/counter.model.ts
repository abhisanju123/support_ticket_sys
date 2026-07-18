import mongoose, { Schema, model, type HydratedDocument, type Model } from 'mongoose';

import { COLLECTIONS } from '../constants/collection.constants.js';

export interface ICounterRecord {
  _id: string;
  seq: number;
}

export type CounterDocument = HydratedDocument<ICounterRecord>;

const counterSchema = new Schema<ICounterRecord>(
  {
    _id: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    collection: COLLECTIONS.COUNTERS,
    versionKey: false,
  },
);

export const Counter = (
  (mongoose.models[COLLECTIONS.COUNTERS] as Model<CounterDocument> | undefined) ??
  model<ICounterRecord>(COLLECTIONS.COUNTERS, counterSchema)
) as Model<CounterDocument>;
