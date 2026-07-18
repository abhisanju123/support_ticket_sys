/**
 * @param {string | Date | undefined} value
 */
export const formatTicketDate = (value) => {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Date-only formatter for ticket table columns.
 * @param {string | Date | undefined} value
 */
export const formatTicketTableDate = (value) => {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Relative time formatter for comments and activity feeds.
 * @param {string | Date | undefined} value
 */
export const formatRelativeTime = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(diffMs)) {
    return '—';
  }

  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 45) {
    return 'just now';
  }

  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return formatTicketTableDate(value);
};

import { OBJECT_ID_REGEX } from '../constants/ticket.constants.js';

/**
 * @param {{ name?: string; email?: string } | string | null | undefined} user
 */
export const formatTicketUser = (user) => {
  if (!user) {
    return 'Unassigned';
  }

  if (typeof user === 'string') {
    if (OBJECT_ID_REGEX.test(user)) {
      return null;
    }

    return user;
  }

  return user.name ?? user.email ?? 'Unknown user';
};

/**
 * Resolve a comment author from a populated user, raw id, or users lookup map.
 * @param {string | { _id?: string; name?: string; email?: string } | null | undefined} createdBy
 * @param {Map<string, { name?: string; email?: string }>} [usersById]
 */
export const resolveCommentAuthor = (createdBy, usersById) => {
  if (!createdBy) {
    return null;
  }

  if (typeof createdBy === 'object') {
    return formatTicketUser(createdBy);
  }

  if (OBJECT_ID_REGEX.test(createdBy)) {
    const user = usersById?.get(createdBy);
    return user ? formatTicketUser(user) : null;
  }

  return formatTicketUser(createdBy);
};
/**
 * Public route/API identifier for a ticket (sequential ticket number).
 * @param {{ ticketNumber?: number; _id?: string } | number | string | null | undefined} ticketOrNumber
 */
export const getTicketRouteId = (ticketOrNumber) => {
  if (ticketOrNumber == null) {
    return '';
  }

  if (typeof ticketOrNumber === 'number') {
    return String(ticketOrNumber);
  }

  if (typeof ticketOrNumber === 'object') {
    if (ticketOrNumber.ticketNumber != null) {
      return String(ticketOrNumber.ticketNumber);
    }

    return ticketOrNumber._id ?? '';
  }

  return String(ticketOrNumber);
};

/**
 * @param {{ ticketNumber?: number; _id?: string } | number | string | null | undefined} ticketOrNumber
 */
export const formatTicketId = (ticketOrNumber) => {
  if (ticketOrNumber == null) {
    return '—';
  }

  if (typeof ticketOrNumber === 'number') {
    return String(ticketOrNumber);
  }

  if (typeof ticketOrNumber === 'object') {
    if (ticketOrNumber.ticketNumber != null) {
      return String(ticketOrNumber.ticketNumber);
    }

    if (ticketOrNumber._id) {
      return ticketOrNumber._id.length > 10
        ? `${ticketOrNumber._id.slice(0, 6)}…${ticketOrNumber._id.slice(-4)}`
        : ticketOrNumber._id;
    }
  }

  if (typeof ticketOrNumber === 'string') {
    return ticketOrNumber.length > 10
      ? `${ticketOrNumber.slice(0, 6)}…${ticketOrNumber.slice(-4)}`
      : ticketOrNumber;
  }

  return '—';
};
