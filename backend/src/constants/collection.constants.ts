export const COLLECTIONS = {
  USERS: 'users',
  TICKETS: 'tickets',
  COMMENTS: 'comments',
  NOTIFICATIONS: 'notifications',
  COUNTERS: 'counters',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
