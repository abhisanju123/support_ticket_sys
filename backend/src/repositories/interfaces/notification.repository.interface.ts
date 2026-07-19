import type { ObjectId } from '../../types/domain.types.js';
import type {
  NotificationCreateInput,
  NotificationListOptions,
} from '../types/notification.repository.types.js';
import type { INotificationRecord } from '../../interfaces/notification.interface.js';

export interface INotificationRepository {
  createMany(data: NotificationCreateInput[]): Promise<INotificationRecord[]>;
  findByRecipient(
    recipientId: string | ObjectId,
    options?: NotificationListOptions,
  ): Promise<INotificationRecord[]>;
  countUnread(recipientId: string | ObjectId): Promise<number>;
  markAsRead(id: string | ObjectId, recipientId: string | ObjectId): Promise<boolean>;
  markAllAsRead(recipientId: string | ObjectId): Promise<number>;
}
