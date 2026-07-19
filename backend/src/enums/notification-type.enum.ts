export enum NotificationType {
  COMMENT_ADDED = 'comment_added',
  TICKET_UPDATED = 'ticket_updated',
  STATUS_CHANGED = 'status_changed',
}

export const NOTIFICATION_TYPES = Object.values(NotificationType);
