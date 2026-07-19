import { UserRole } from '../enums/user-role.enum.js';
import type { ObjectId } from '../types/domain.types.js';

const toId = (value: string | ObjectId | undefined | null): string | null => {
  if (value == null) {
    return null;
  }

  return String(value);
};

const isStaffRole = (role: UserRole): boolean =>
  role === UserRole.ADMIN || role === UserRole.SUPPORT_AGENT;

/**
 * Resolves who should receive in-app bell notifications for ticket activity.
 * - Employees never notify themselves.
 * - Employee activity notifies the assignee.
 * - Admin/agent activity notifies the employee who created the ticket.
 */
export function resolveNotificationRecipients(params: {
  actorId: string;
  actorRole: UserRole;
  ticket: {
    createdBy: string | ObjectId;
    assignedTo?: string | ObjectId | null;
  };
  creatorRole: UserRole;
}): string[] {
  const { actorId, actorRole, ticket, creatorRole } = params;
  const creatorId = toId(ticket.createdBy);
  const assigneeId = toId(ticket.assignedTo);
  const recipients = new Set<string>();

  if (actorRole === UserRole.EMPLOYEE) {
    if (assigneeId && assigneeId !== actorId) {
      recipients.add(assigneeId);
    }
  } else if (isStaffRole(actorRole)) {
    if (creatorId && creatorId !== actorId && creatorRole === UserRole.EMPLOYEE) {
      recipients.add(creatorId);
    }
  }

  return [...recipients];
}
