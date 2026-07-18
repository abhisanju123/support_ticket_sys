import { TicketPriority } from '../enums/ticket-priority.enum.js';
import { TicketStatus } from '../enums/ticket-status.enum.js';
import { UserRole } from '../enums/user-role.enum.js';

export const DEFAULT_TICKET_STATUS = TicketStatus.OPEN;
export const DEFAULT_TICKET_PRIORITY = TicketPriority.MEDIUM;
export const DEFAULT_USER_ROLE = UserRole.EMPLOYEE;

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: 'Open',
  [TicketStatus.IN_PROGRESS]: 'In Progress',
  [TicketStatus.ON_HOLD]: 'On Hold',
  [TicketStatus.RESOLVED]: 'Resolved',
  [TicketStatus.CLOSED]: 'Closed',
  [TicketStatus.CANCELLED]: 'Cancelled',
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  [TicketPriority.LOW]: 'Low',
  [TicketPriority.MEDIUM]: 'Medium',
  [TicketPriority.HIGH]: 'High',
  [TicketPriority.CRITICAL]: 'Critical',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.EMPLOYEE]: 'Employee',
  [UserRole.SUPPORT_AGENT]: 'Support Agent',
  [UserRole.ADMIN]: 'Admin',
};
