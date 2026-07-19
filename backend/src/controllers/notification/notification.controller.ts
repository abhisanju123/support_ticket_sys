import type { Request, Response } from 'express';

import { ApiResponse, getAuthenticatedUser } from '../../helpers/index.js';
import { asyncHandler } from '../../middlewares/index.js';
import type { NotificationService } from '../../services/notification/notification.service.js';

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  listNotifications = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const notifications = await this.notificationService.listForUser(user);

    ApiResponse.success(res, notifications, 'Notifications retrieved successfully');
  });

  markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    await this.notificationService.markAsRead(String(req.params.id), user);

    ApiResponse.success(res, null, 'Notification marked as read');
  });

  markAllNotificationsRead = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    await this.notificationService.markAllAsRead(user);

    ApiResponse.success(res, null, 'All notifications marked as read');
  });
}
