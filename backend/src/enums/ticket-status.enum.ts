export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

export const TICKET_STATUSES = Object.values(TicketStatus);

export const TICKET_STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  [TicketStatus.OPEN]: [
    TicketStatus.IN_PROGRESS,
    TicketStatus.ON_HOLD,
    TicketStatus.CLOSED,
    TicketStatus.CANCELLED,
  ],
  [TicketStatus.IN_PROGRESS]: [
    TicketStatus.ON_HOLD,
    TicketStatus.RESOLVED,
    TicketStatus.CLOSED,
    TicketStatus.CANCELLED,
  ],
  [TicketStatus.ON_HOLD]: [
    TicketStatus.IN_PROGRESS,
    TicketStatus.CLOSED,
    TicketStatus.CANCELLED,
  ],
  [TicketStatus.RESOLVED]: [TicketStatus.CLOSED, TicketStatus.IN_PROGRESS],
  [TicketStatus.CLOSED]: [],
  [TicketStatus.CANCELLED]: [],
};

export const TERMINAL_TICKET_STATUSES: TicketStatus[] = [
  TicketStatus.CLOSED,
  TicketStatus.CANCELLED,
];

/** Tickets in these statuses cannot be updated via PUT /tickets/:id */
export const NON_EDITABLE_TICKET_STATUSES: TicketStatus[] = [
  TicketStatus.RESOLVED,
  TicketStatus.CLOSED,
  TicketStatus.CANCELLED,
];
