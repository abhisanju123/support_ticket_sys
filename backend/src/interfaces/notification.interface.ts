import type { NotificationType } from '../enums/notification-type.enum.js';
import type { ObjectId } from '../types/domain.types.js';

/** Core notification fields stored in MongoDB. */
export interface INotification {
  recipientId: ObjectId;
  type: NotificationType;
  message: string;
  ticketNumber: number;
  ticketTitle: string;
  actorId: ObjectId;
  actorName: string;
  read: boolean;
}

/** Full persisted notification document including id and timestamps. */
export interface INotificationRecord extends INotification {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
