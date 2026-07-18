import { TICKET_STATUS_LABELS } from '../constants/ticket.constants.js';
import { formatTicketId, formatTicketUser, resolveCommentAuthor } from './ticketFormatters.js';

const truncate = (text, maxLength = 80) => {
  if (!text) {
    return '';
  }

  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
};

/**
 * Builds a mock activity timeline from ticket fields and comments until audit log API exists.
 * @param {Record<string, any>} ticket
 * @param {Array<Record<string, any>>} comments
 * @param {Map<string, { name?: string; email?: string }>} [usersById]
 */
export function buildTicketActivity(ticket, comments = [], usersById) {
  const events = [];
  const ticketLabel = formatTicketId(ticket);

  events.push({
    id: `created-${ticket._id}`,
    type: 'created',
    title: 'Ticket created',
    description: `${ticketLabel} was submitted`,
    timestamp: ticket.createdAt,
  });

  if (ticket.assignedTo) {
    const assignee =
      resolveCommentAuthor(ticket.assignedTo, usersById) ??
      (typeof ticket.assignedTo === 'object' ? formatTicketUser(ticket.assignedTo) : null);

    events.push({
      id: `assigned-${ticket._id}`,
      type: 'assigned',
      title: 'Assigned',
      description: assignee ? `Assigned to ${assignee}` : 'Assignee updated',
      timestamp: ticket.updatedAt ?? ticket.createdAt,
    });
  }

  const createdTime = new Date(ticket.createdAt).getTime();
  const updatedTime = new Date(ticket.updatedAt).getTime();

  if (ticket.updatedAt && Math.abs(updatedTime - createdTime) > 1000) {
    events.push({
      id: `status-${ticket._id}-${ticket.status}`,
      type: 'status_changed',
      title: 'Status updated',
      description: `Current status: ${TICKET_STATUS_LABELS[ticket.status] ?? ticket.status}`,
      timestamp: ticket.updatedAt,
    });
  }

  comments.forEach((comment) => {
    const author = resolveCommentAuthor(comment.createdBy, usersById);

    events.push({
      id: `comment-${comment._id}`,
      type: 'comment_added',
      title: 'Comment added',
      description: author
        ? `${author}: ${truncate(comment.message)}`
        : truncate(comment.message),
      timestamp: comment.createdAt,
    });
  });

  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};
