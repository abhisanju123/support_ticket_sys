import { Router } from 'express';

import type { NotificationController } from '../controllers/notification/notification.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { notificationIdParamSchema } from '../schemas/request/notification.request.schema.js';

export const createNotificationRouter = (notificationController: NotificationController): Router => {
  const router = Router();

  router.get('/unread-count', notificationController.getUnreadCount);
  router.get('/', notificationController.listNotifications);
  router.patch('/read-all', notificationController.markAllNotificationsRead);
  router.patch(
    '/:id/read',
    validate({ params: notificationIdParamSchema }),
    notificationController.markNotificationRead,
  );

  return router;
};
