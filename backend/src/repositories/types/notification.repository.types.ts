import type { INotificationRecord } from '../../interfaces/notification.interface.js';
import type { RepositoryCreateInput } from './repository.types.js';

export type NotificationCreateInput = RepositoryCreateInput<INotificationRecord>;

export interface NotificationListOptions {
  limit?: number;
  skip?: number;
  unreadOnly?: boolean;
}

export interface NotificationResponse {
  _id: string;
  type: INotificationRecord['type'];
  message: string;
  ticketNumber: number;
  ticketTitle: string;
  actorId: string;
  actorName: string;
  read: boolean;
  createdAt: string;
}
