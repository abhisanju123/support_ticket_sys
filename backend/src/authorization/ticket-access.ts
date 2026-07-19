import { NON_EDITABLE_TICKET_STATUSES, TicketStatus } from '../enums/ticket-status.enum.js';
import { Permission } from '../enums/permission.enum.js';
import { UserRole } from '../enums/user-role.enum.js';
import { ForbiddenException, NotFoundException, ValidationException } from '../exceptions/index.js';
import type { IUserRepository } from '../repositories/interfaces/user.repository.interface.js';
import { hasPermission } from './permission-check.js';
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
  if (NON_EDITABLE_TICKET_STATUSES.includes(ticket.status)) {
    throw new ForbiddenException('Resolved, closed, and cancelled tickets cannot be edited');
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

const resolveCommentAuthorId = (
  createdBy: string | ObjectId | { _id?: string | ObjectId },
): string => {
  if (createdBy && typeof createdBy === 'object' && '_id' in createdBy && createdBy._id != null) {
    return String(createdBy._id);
  }

  return String(createdBy);
};

export interface CommentAuthorFields {
  createdBy: string | ObjectId | { _id?: string | ObjectId };
}

export function assertCanEditComment(
  user: AuthenticatedUser,
  comment: CommentAuthorFields,
): void {
  if (resolveCommentAuthorId(comment.createdBy) !== user.id) {
    throw new ForbiddenException('You can only edit your own comments');
  }
}

export function assertCanDeleteComment(
  user: AuthenticatedUser,
  comment: CommentAuthorFields,
): void {
  if (
    resolveCommentAuthorId(comment.createdBy) !== user.id &&
    user.role !== UserRole.ADMIN
  ) {
    throw new ForbiddenException('You can only delete your own comments');
  }
}

export function getTicketListScope(user: AuthenticatedUser): { accessibleToUserId?: string } {
  if (canViewAllTickets(user.role)) {
    return {};
  }

  return { accessibleToUserId: user.id };
}

export async function assertValidAssignee(
  userRepository: IUserRepository,
  assigneeId: string,
): Promise<void> {
  const assignee = await userRepository.findById(assigneeId);

  if (!assignee) {
    throw new NotFoundException('Assigned user not found');
  }

  if (!hasPermission(assignee.role, Permission.TICKET_CHANGE_STATUS)) {
    throw new ValidationException('Tickets can only be assigned to support agents or admins');
  }
}
