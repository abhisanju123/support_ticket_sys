import mongoose, { Schema, model, type HydratedDocument, type Model } from 'mongoose';

import { COLLECTIONS } from '../constants/collection.constants.js';
import { USER_ROLES } from '../enums/user-role.enum.js';
import type { IUserRecord } from '../interfaces/user.interface.js';
import { applySchemaIndexes } from '../database/apply-indexes.js';

export type UserDocument = HydratedDocument<IUserRecord>;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [255, 'Email cannot exceed 255 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: USER_ROLES,
        message: 'Invalid user role',
      },
    },
    passwordHash: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTIONS.USERS,
  },
);

applySchemaIndexes(userSchema, COLLECTIONS.USERS);

export const User = (
  (mongoose.models[COLLECTIONS.USERS] as Model<UserDocument> | undefined) ??
  model(COLLECTIONS.USERS, userSchema)
) as Model<UserDocument>;
