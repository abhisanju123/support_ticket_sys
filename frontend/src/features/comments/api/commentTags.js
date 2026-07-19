/** @param {string} ticketId */
export const commentListTag = (ticketId) => ({ type: 'Comment', id: `LIST-${ticketId}` });

/**
 * Invalidates comment list and related ticket data after comment changes.
 * @param {string} ticketId
 */
export const commentMutationInvalidationTags = (ticketId) => [
  commentListTag(ticketId),
  { type: 'Ticket', id: ticketId },
  { type: 'Dashboard', id: 'STATS' },
  { type: 'Ticket', id: 'LIST' },
  { type: 'Notification', id: 'COUNT' },
  { type: 'Notification', id: 'LIST' },
];

export const commentCreateInvalidationTags = (ticketId) => commentMutationInvalidationTags(ticketId);
