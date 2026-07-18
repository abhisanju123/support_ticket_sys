import { TICKET_PRIORITY_LABELS } from '../constants/ticket.constants.js';

import { TicketPriorityChip as BusinessTicketPriorityChip } from '../../../components/business/tickets/list/TicketPriorityChip.jsx';

export function TicketPriorityChip({ priority, size = 'small' }) {
  return (
    <BusinessTicketPriorityChip
      label={TICKET_PRIORITY_LABELS[priority] ?? priority}
      priority={priority}
      size={size}
    />
  );
}
