import { TicketStatus } from '../../enums/ticket-status.enum.js';

/**
 * Canonical ticket status transitions enforced by TicketStatusService.
 * This is the single source of truth for lifecycle rules.
 */
export const ALLOWED_TICKET_STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED],
  [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED, TicketStatus.CANCELLED],
  [TicketStatus.ON_HOLD]: [],
  [TicketStatus.RESOLVED]: [TicketStatus.CLOSED],
  [TicketStatus.CLOSED]: [],
  [TicketStatus.CANCELLED]: [],
};

export const isAllowedTicketStatusTransition = (
  currentStatus: TicketStatus,
  nextStatus: TicketStatus,
): boolean => {
  if (currentStatus === nextStatus) {
    return false;
  }

  return ALLOWED_TICKET_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
};
