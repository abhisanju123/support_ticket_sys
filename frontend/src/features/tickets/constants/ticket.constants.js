export const TICKET_PRIORITIES = ['low', 'medium', 'high', 'critical'];

export const TICKET_FILTER_STATUSES = [
  'open',
  'in_progress',
  'resolved',
  'closed',
  'cancelled',
];

export const TICKET_WORKFLOW_STEPS = [
  { status: 'open', label: 'Open' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'resolved', label: 'Resolved' },
  { status: 'closed', label: 'Closed' },
];

export const TICKET_STATUSES = [
  'open',
  'in_progress',
  'on_hold',
  'resolved',
  'closed',
  'cancelled',
];

export const TICKET_PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const TICKET_STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  on_hold: 'On Hold',
  resolved: 'Resolved',
  closed: 'Closed',
  cancelled: 'Cancelled',
};

/** Allowed next statuses per API contract §1.4 */
export const TICKET_STATUS_TRANSITIONS = {
  open: ['in_progress', 'cancelled'],
  in_progress: ['resolved', 'cancelled'],
  on_hold: [],
  resolved: ['closed'],
  closed: [],
  cancelled: [],
};

export const TICKET_SORT_FIELDS = ['ticketNumber', 'createdAt', 'updatedAt', 'title', 'priority', 'status'];

export const TICKET_LIST_COLUMNS = [
  { id: '_id', label: 'Ticket ID', sortable: true, sortKey: 'ticketNumber' },
  { id: 'title', label: 'Title', sortable: true, sortKey: 'title' },
  { id: 'priority', label: 'Priority', sortable: true, sortKey: 'priority' },
  { id: 'status', label: 'Status', sortable: true, sortKey: 'status' },
  { id: 'assignedTo', label: 'Assigned To', sortable: false },
  { id: 'createdBy', label: 'Created By', sortable: false },
  { id: 'createdAt', label: 'Created Date', sortable: true, sortKey: 'createdAt' },
  { id: 'updatedAt', label: 'Updated Date', sortable: true, sortKey: 'updatedAt' },
  { id: 'actions', label: 'Actions', sortable: false },
];

/** Tickets in these statuses cannot be edited via the update API or edit form. */
export const NON_EDITABLE_TICKET_STATUSES = ['closed', 'cancelled'];

/**
 * @param {{ status?: string } | null | undefined} ticket
 * @returns {boolean}
 */
export function isTicketEditable(ticket) {
  return !NON_EDITABLE_TICKET_STATUSES.includes(ticket?.status);
}

export const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;
