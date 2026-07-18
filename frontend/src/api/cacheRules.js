/**
 * RTK Query cache invalidation rules (server state only).
 *
 * Ticket list + dashboard refresh after: create ticket, update ticket, status change.
 * Ticket detail refreshes after: update ticket, status change, add comment.
 * Comments refresh after: add comment.
 */

export {
  DASHBOARD_STATS_TAG,
  TICKET_LIST_TAG,
  ticketDetailTag,
  ticketListTags,
  ticketUpdateInvalidationTags,
  ticketWriteInvalidationTags,
} from '../../features/tickets/api/ticketTags.js';

export {
  commentCreateInvalidationTags,
  commentListTag,
} from '../../features/comments/api/commentTags.js';
