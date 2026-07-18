import { TICKET_STATUS_LABELS } from '../constants/ticket.constants.js';

import { TicketStatusBadge } from '../../../components/business/tickets/list/TicketStatusBadge.jsx';

export function TicketStatusChip({ status, size = 'small' }) {
  return (
    <TicketStatusBadge
      label={TICKET_STATUS_LABELS[status] ?? status}
      status={status}
      size={size}
    />
  );
}
