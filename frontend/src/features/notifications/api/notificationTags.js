export const NOTIFICATIONS_TAG = 'Notification';

export const notificationsListTag = () => ({ type: NOTIFICATIONS_TAG, id: 'LIST' });

export const notificationsCountTag = () => ({ type: NOTIFICATIONS_TAG, id: 'COUNT' });

export const notificationInvalidationTags = () => [
  notificationsListTag(),
  notificationsCountTag(),
];

export const notificationCountInvalidationTags = () => [notificationsCountTag()];
