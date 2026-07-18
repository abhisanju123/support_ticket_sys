import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { TicketActionMenu } from './TicketActionMenu.jsx';
import { TicketTablePriorityLabel } from './TicketTablePriorityLabel.jsx';
import { TicketTableStatusLabel } from './TicketTableStatusLabel.jsx';
import { getTableRowSx, TABLE_BODY_CELL_SX } from '../../shared/tableStyles.js';

const bodyCellSx = TABLE_BODY_CELL_SX;

const stopRowClick = (event) => {
  event.stopPropagation();
};

export function TicketTableRow({
  ticket,
  columns = [],
  rowIndex = 0,
  ticketIdLabel,
  priorityLabel,
  statusLabel,
  assignedToLabel,
  createdByLabel = '—',
  createdAtLabel,
  updatedAtLabel,
  onView,
  onEdit,
  onDelete,
  useActionMenu = false,
}) {
  const viewAction = onView
    ? {
        id: 'view',
        label: 'View',
        icon: <VisibilityOutlinedIcon fontSize="small" />,
        onClick: () => onView(ticket),
      }
    : null;

  const editAction = onEdit
    ? {
        id: 'edit',
        label: 'Edit',
        icon: <EditOutlinedIcon fontSize="small" />,
        onClick: () => onEdit(ticket),
      }
    : null;

  const deleteAction = onDelete
    ? {
        id: 'delete',
        label: 'Delete',
        icon: <DeleteOutlinedIcon fontSize="small" />,
        onClick: () => onDelete(ticket),
      }
    : null;

  const menuActions = [viewAction, editAction, deleteAction].filter(Boolean);

  const renderActions = () => {
    if (useActionMenu) {
      return (
        <Box onClick={stopRowClick}>
          <TicketActionMenu actions={menuActions} ariaLabel={`Actions for ${ticket.title}`} />
        </Box>
      );
    }

    return (
      <Box className="ticket-table-actions inline-spacing" onClick={stopRowClick}>
        {viewAction ? (
          <Tooltip title="View details">
            <IconButton
              aria-label={`View ticket ${ticket.title}`}
              size="small"
              onClick={viewAction.onClick}
              sx={{ color: 'primary.main' }}
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null}
        {editAction ? (
          <Tooltip title="Edit ticket">
            <IconButton
              aria-label={`Edit ticket ${ticket.title}`}
              size="small"
              onClick={editAction.onClick}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null}
        {deleteAction ? (
          <Tooltip title="Delete ticket">
            <IconButton
              aria-label={`Delete ticket ${ticket.title}`}
              size="small"
              onClick={deleteAction.onClick}
              color="error"
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>
    );
  };

  const columnVisibility = {
    _id: 'table-cell',
    title: 'table-cell',
    priority: 'table-cell',
    status: 'table-cell',
    assignedTo: 'table-cell',
    createdBy: { xs: 'none', md: 'table-cell' },
    createdAt: 'table-cell',
    updatedAt: { xs: 'none', lg: 'table-cell' },
    actions: 'table-cell',
  };

  return (
    <TableRow
      hover
      onClick={onView ? () => onView(ticket) : undefined}
      sx={getTableRowSx(rowIndex, { clickable: Boolean(onView) })}
    >
      {columns.map((column) => {
        const visibility = columnVisibility[column.id] ?? 'table-cell';

        return (
          <TableCell key={column.id} sx={{ ...bodyCellSx, display: visibility }}>
            {column.id === '_id' ? (
              <Typography variant="body2" fontWeight={700} color="primary.main">
                {ticketIdLabel ?? '—'}
              </Typography>
            ) : null}
            {column.id === 'title' ? (
              <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 280 }}>
                {ticket.title}
              </Typography>
            ) : null}
            {column.id === 'priority' ? (
              <TicketTablePriorityLabel label={priorityLabel} priority={ticket.priority} />
            ) : null}
            {column.id === 'status' ? (
              <TicketTableStatusLabel label={statusLabel} status={ticket.status} />
            ) : null}
            {column.id === 'assignedTo' ? (
              <Typography
                variant="body2"
                color={assignedToLabel === 'Unassigned' ? 'text.secondary' : 'text.primary'}
                noWrap
              >
                {assignedToLabel}
              </Typography>
            ) : null}
            {column.id === 'createdBy' ? (
              <Typography variant="body2" noWrap>
                {createdByLabel}
              </Typography>
            ) : null}
            {column.id === 'createdAt' ? (
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                {createdAtLabel}
              </Typography>
            ) : null}
            {column.id === 'updatedAt' ? (
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                {updatedAtLabel}
              </Typography>
            ) : null}
            {column.id === 'actions' ? renderActions() : null}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
