export const TICKET_LIST_TAG = { type: 'Ticket', id: 'LIST' };

export const DASHBOARD_STATS_TAG = { type: 'Dashboard', id: 'STATS' };

/** @param {string} id */
export const ticketDetailTag = (id) => ({ type: 'Ticket', id });

/**
 * @param {Array<{ ticketNumber?: number; _id?: string }> | undefined} result
 */
export const ticketListTags = (result) => {
  if (!Array.isArray(result)) {
    return [TICKET_LIST_TAG];
  }

  return [TICKET_LIST_TAG, ...result.map((ticket) => ticketDetailTag(getTicketCacheId(ticket)))];
};

/** @param {{ ticketNumber?: number; _id?: string } | string | number} ticketOrId */
export const getTicketCacheId = (ticketOrId) => {
  if (ticketOrId == null) {
    return '';
  }

  if (typeof ticketOrId === 'object') {
    return ticketOrId.ticketNumber != null ? String(ticketOrId.ticketNumber) : ticketOrId._id ?? '';
  }

  return String(ticketOrId);
};

export const ticketWriteInvalidationTags = [TICKET_LIST_TAG, DASHBOARD_STATS_TAG];

/** @param {string} id */
export const ticketDeleteInvalidationTags = (id) => [
  TICKET_LIST_TAG,
  ticketDetailTag(id),
  DASHBOARD_STATS_TAG,
  { type: 'Comment', id: `LIST-${id}` },
];

/** @param {string} id */
export const ticketUpdateInvalidationTags = (id) => [
  TICKET_LIST_TAG,
  ticketDetailTag(id),
  DASHBOARD_STATS_TAG,
  { type: 'Notification', id: 'COUNT' },
  { type: 'Notification', id: 'LIST' },
];
