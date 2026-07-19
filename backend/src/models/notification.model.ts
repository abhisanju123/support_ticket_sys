import mongoose, { Schema, model, type HydratedDocument, type Model } from 'mongoose';

import { COLLECTIONS } from '../constants/collection.constants.js';
import { NOTIFICATION_TYPES } from '../enums/notification-type.enum.js';
import { applySchemaIndexes } from '../database/apply-indexes.js';
import type { INotificationRecord } from '../interfaces/notification.interface.js';

export type NotificationDocument = HydratedDocument<INotificationRecord>;

const notificationSchema = new Schema(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: COLLECTIONS.USERS,
      required: [true, 'recipientId is required'],
      index: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: [true, 'type is required'],
    },
    message: {
      type: String,
      required: [true, 'message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    ticketNumber: {
      type: Number,
      required: [true, 'ticketNumber is required'],
    },
    ticketTitle: {
      type: String,
      required: [true, 'ticketTitle is required'],
      trim: true,
      maxlength: [200, 'ticketTitle cannot exceed 200 characters'],
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: COLLECTIONS.USERS,
      required: [true, 'actorId is required'],
    },
    actorName: {
      type: String,
      required: [true, 'actorName is required'],
      trim: true,
      maxlength: [120, 'actorName cannot exceed 120 characters'],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTIONS.NOTIFICATIONS,
  },
);

applySchemaIndexes(notificationSchema, COLLECTIONS.NOTIFICATIONS);

export const Notification = (
  (mongoose.models[COLLECTIONS.NOTIFICATIONS] as Model<NotificationDocument> | undefined) ??
  model(COLLECTIONS.NOTIFICATIONS, notificationSchema)
) as Model<NotificationDocument>;
