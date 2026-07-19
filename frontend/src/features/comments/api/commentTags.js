/** @param {string} ticketId */
export const commentListTag = (ticketId) => ({ type: 'Comment', id: `LIST-${ticketId}` });

/**
 * Invalidates comment list and parent ticket detail after a new comment.
 * @param {string} ticketId
 */
export const commentCreateInvalidationTags = (ticketId) => [
  commentListTag(ticketId),
  { type: 'Ticket', id: ticketId },
  { type: 'Dashboard', id: 'STATS' },
  { type: 'Ticket', id: 'LIST' },
  { type: 'Notification', id: 'LIST' },
];
