import { useNavigate } from 'react-router-dom';

import { TicketTable } from '../../../components/business/tickets/list/TicketTable.jsx';
import { usePermissions } from '../../auth/hooks/usePermissions.js';
import { buildEditTicketPath, buildTicketDetailsPath } from '../../../constants/routes.constants.js';
import {
  TICKET_LIST_COLUMNS,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
} from '../constants/ticket.constants.js';
import { formatTicketId, formatTicketTableDate, formatTicketUser, getTicketRouteId } from '../utils/ticketFormatters.js';

export function TicketListTable({
  tickets,
  totalCount,
  sortBy,
  sortOrder,
  onSort,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onDelete,
  isLoading = false,
  showSkeleton = false,
  embedded = false,
}) {
  const navigate = useNavigate();
  const { canEditTicket, canDeleteTicket } = usePermissions();
  const allowDelete = canDeleteTicket();

  return (
    <TicketTable
      tickets={tickets}
      columns={TICKET_LIST_COLUMNS}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      isLoading={isLoading}
      showSkeleton={showSkeleton}
      embedded={embedded}
      getRowProps={(ticket) => ({
        ticketIdLabel: formatTicketId(ticket),
        priorityLabel: TICKET_PRIORITY_LABELS[ticket.priority] ?? ticket.priority,
        statusLabel: TICKET_STATUS_LABELS[ticket.status] ?? ticket.status,
        assignedToLabel: formatTicketUser(ticket.assignedTo),
        createdByLabel: formatTicketUser(ticket.createdBy),
        createdAtLabel: formatTicketTableDate(ticket.createdAt),
        updatedAtLabel: formatTicketTableDate(ticket.updatedAt),
        onView: () => navigate(buildTicketDetailsPath(getTicketRouteId(ticket))),
        onEdit: canEditTicket(ticket)
          ? () => navigate(buildEditTicketPath(getTicketRouteId(ticket)))
          : undefined,
        onDelete: onDelete && allowDelete ? () => onDelete(ticket) : undefined,
      })}
    />
  );
}
