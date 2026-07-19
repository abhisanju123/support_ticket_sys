export const NOTIFICATIONS_TAG = 'Notification';

export const notificationsListTag = () => ({ type: NOTIFICATIONS_TAG, id: 'LIST' });

export const notificationInvalidationTags = () => [notificationsListTag()];
