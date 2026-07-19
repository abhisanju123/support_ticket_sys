import { isValidObjectId } from 'mongoose';

import type { INotificationRecord } from '../interfaces/notification.interface.js';
import type { ObjectId } from '../types/domain.types.js';
import { Notification } from '../models/notification.model.js';
import { BaseRepository } from './base/base.repository.js';
import type { INotificationRepository } from './interfaces/notification.repository.interface.js';
import type {
  NotificationCreateInput,
  NotificationListOptions,
} from './types/notification.repository.types.js';

const DEFAULT_LIST_LIMIT = 10;

export class NotificationRepository
  extends BaseRepository<INotificationRecord>
  implements INotificationRepository
{
  constructor() {
    super(Notification, 'Notification');
  }

  async createMany(data: NotificationCreateInput[]): Promise<INotificationRecord[]> {
    if (data.length === 0) {
      return [];
    }

    try {
      const documents = await this.model.insertMany(data);
      return this.toDomainList(documents);
    } catch (error) {
      throw this.handleError(error, 'createMany');
    }
  }

  async findByRecipient(
    recipientId: string | ObjectId,
    options: NotificationListOptions = {},
  ): Promise<INotificationRecord[]> {
    if (!isValidObjectId(recipientId)) {
      return [];
    }

    const { limit = DEFAULT_LIST_LIMIT, skip = 0, unreadOnly = false } = options;

    return this.findAll({
      filter: {
        recipientId: this.toObjectId(recipientId),
        ...(unreadOnly ? { read: false } : {}),
      },
      sort: { createdAt: -1 },
      skip,
      limit,
    });
  }

  async countUnread(recipientId: string | ObjectId): Promise<number> {
    if (!isValidObjectId(recipientId)) {
      return 0;
    }

    return this.count({
      recipientId: this.toObjectId(recipientId),
      read: false,
    });
  }

  async markAsRead(id: string | ObjectId, recipientId: string | ObjectId): Promise<boolean> {
    if (!isValidObjectId(id) || !isValidObjectId(recipientId)) {
      return false;
    }

    try {
      const result = await this.model
        .updateOne(
          {
            _id: this.toObjectId(id),
            recipientId: this.toObjectId(recipientId),
          },
          { $set: { read: true } },
        )
        .exec();

      return result.modifiedCount > 0;
    } catch (error) {
      throw this.handleError(error, 'markAsRead');
    }
  }

  async markAllAsRead(recipientId: string | ObjectId): Promise<number> {
    if (!isValidObjectId(recipientId)) {
      return 0;
    }

    try {
      const result = await this.model
        .updateMany(
          { recipientId: this.toObjectId(recipientId), read: false },
          { $set: { read: true } },
        )
        .exec();

      return result.modifiedCount;
    } catch (error) {
      throw this.handleError(error, 'markAllAsRead');
    }
  }
}
