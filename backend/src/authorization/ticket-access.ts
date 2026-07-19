import { TERMINAL_TICKET_STATUSES, TicketStatus } from '../enums/ticket-status.enum.js';
import { UserRole } from '../enums/user-role.enum.js';
import { ForbiddenException, NotFoundException } from '../exceptions/index.js';
import type { AuthenticatedUser } from '../types/auth.types.js';
import type { ObjectId } from '../types/domain.types.js';

export interface TicketAccessFields {
  createdBy: string | ObjectId | { _id?: string | ObjectId };
  assignedTo?: string | ObjectId | { _id?: string | ObjectId } | null;
  status?: TicketStatus;
}

const resolveAccessUserId = (value: TicketAccessFields['createdBy']): string => {
  if (value && typeof value === 'object' && '_id' in value && value._id != null) {
    return String(value._id);
  }

  return String(value);
};

export function canViewAllTickets(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.SUPPORT_AGENT;
}

export function isTicketAccessibleToUser(ticket: TicketAccessFields, userId: string): boolean {
  const createdById = resolveAccessUserId(ticket.createdBy);
  const assignedToId =
    ticket.assignedTo != null ? resolveAccessUserId(ticket.assignedTo) : '';

  return createdById === userId || (assignedToId !== '' && assignedToId === userId);
}

export function assertTicketVisible(user: AuthenticatedUser, ticket: TicketAccessFields): void {
  if (canViewAllTickets(user.role)) {
    return;
  }

  if (!isTicketAccessibleToUser(ticket, user.id)) {
    throw new NotFoundException('Ticket not found');
  }
}

export function assertCanEditTicket(
  user: AuthenticatedUser,
  ticket: TicketAccessFields & { status: TicketStatus },
): void {
  if (TERMINAL_TICKET_STATUSES.includes(ticket.status)) {
    throw new ForbiddenException('Closed and cancelled tickets cannot be edited');
  }

  if (user.role === UserRole.EMPLOYEE && resolveAccessUserId(ticket.createdBy) !== user.id) {
    throw new ForbiddenException('You can only edit your own tickets');
  }
}

export function assertEmployeeCreatesOwnTicket(user: AuthenticatedUser, createdBy: string): void {
  if (user.role === UserRole.EMPLOYEE && createdBy !== user.id) {
    throw new ForbiddenException('You can only create tickets for yourself');
  }
}

export function assertCommentAuthorIsSelf(user: AuthenticatedUser, createdBy: string): void {
  if (createdBy !== user.id) {
    throw new ForbiddenException('You can only add comments as yourself');
  }
}

export function getTicketListScope(user: AuthenticatedUser): { accessibleToUserId?: string } {
  if (canViewAllTickets(user.role)) {
    return {};
  }

  return { accessibleToUserId: user.id };
}
