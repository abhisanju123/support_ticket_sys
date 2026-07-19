import { isTicketEditable } from '../../tickets/constants/ticket.constants.js';
import { hasPermission, Permission, UserRole } from '../constants/permissions.js';

export function resolveUserId(value) {
  if (!value) {
    return '';
  }

  return typeof value === 'object' ? String(value._id ?? '') : String(value);
}

export function canViewAllTickets(role) {
  return role === UserRole.ADMIN || role === UserRole.SUPPORT_AGENT;
}

export function isTicketAccessibleToUser(ticket, userId) {
  if (!ticket || !userId) {
    return false;
  }

  const createdById = resolveUserId(ticket.createdBy);
  const assignedToId = resolveUserId(ticket.assignedTo);

  return createdById === userId || (assignedToId !== '' && assignedToId === userId);
}

export function canViewTicket(user, ticket) {
  if (!user || !ticket) {
    return false;
  }

  if (canViewAllTickets(user.role)) {
    return true;
  }

  return isTicketAccessibleToUser(ticket, user._id);
}

export function canEditTicket(user, ticket) {
  if (!user || !ticket || !isTicketEditable(ticket)) {
    return false;
  }

  if (!hasPermission(user.role, Permission.TICKET_EDIT)) {
    return false;
  }

  if (user.role === UserRole.EMPLOYEE) {
    return resolveUserId(ticket.createdBy) === user._id;
  }

  return true;
}

export function canDeleteTicket(role) {
  return hasPermission(role, Permission.TICKET_DELETE);
}

export function canChangeTicketStatus(role) {
  return hasPermission(role, Permission.TICKET_CHANGE_STATUS);
}

export function canCreateTicket(role) {
  return hasPermission(role, Permission.TICKET_CREATE);
}

export function canCommentOnTicket(user, ticket) {
  return canViewTicket(user, ticket) && hasPermission(user?.role, Permission.COMMENT_CREATE);
}

export function canEditComment(user, comment) {
  if (!user || !comment) {
    return false;
  }

  return resolveUserId(comment.createdBy) === user._id;
}

export function canDeleteComment(user, comment) {
  return canEditComment(user, comment);
}

export function mustCreateTicketAsSelf(role) {
  return role === UserRole.EMPLOYEE;
}

export function filterAssignableUsers(users = []) {
  return users.filter((user) => canChangeTicketStatus(user.role));
}
