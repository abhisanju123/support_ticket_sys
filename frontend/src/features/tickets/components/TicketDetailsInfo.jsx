import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

import { MetadataGrid, MetadataItem } from '../../../components/business/shared/index.js';
import { TicketTablePriorityLabel } from '../../../components/business/tickets/list/TicketTablePriorityLabel.jsx';
import { TicketTableStatusLabel } from '../../../components/business/tickets/list/TicketTableStatusLabel.jsx';
import { buildEditTicketPath } from '../../../constants/routes.constants.js';
import { TICKET_PRIORITY_LABELS, TICKET_STATUS_LABELS, isTicketEditable } from '../constants/ticket.constants.js';
import { formatTicketDate, formatTicketId, getTicketRouteId } from '../utils/ticketFormatters.js';

import { TicketUserCell } from './TicketUserCell.jsx';

/**
 * @param {{
 *   ticket: Record<string, any>;
 *   onDelete?: () => void;
 *   isDeleting?: boolean;
 * }} props
 */
export function TicketDetailsInfo({ ticket, onDelete, isDeleting = false }) {
  const canEdit = isTicketEditable(ticket);

  return (
    <Box className="surface-card shadow-elevated card-spacing stack-spacing">
      <Box className="inline-spacing" sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box className="stack-spacing" sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" component="h2" className="text-heading text-balance">
            {ticket.title}
          </Typography>
          <Box className="inline-spacing" sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="body2" component="span">
              <Box component="span" color="text.secondary">
                Status:{' '}
              </Box>
              <TicketTableStatusLabel
                label={TICKET_STATUS_LABELS[ticket.status] ?? ticket.status}
                status={ticket.status}
              />
            </Typography>
            <Typography variant="body2" component="span">
              <Box component="span" color="text.secondary">
                Priority:{' '}
              </Box>
              <TicketTablePriorityLabel
                label={TICKET_PRIORITY_LABELS[ticket.priority] ?? ticket.priority}
                priority={ticket.priority}
              />
            </Typography>
          </Box>
        </Box>

        <Box className="inline-spacing" sx={{ flexShrink: 0 }}>
          {canEdit ? (
            <Button
              component={RouterLink}
              to={buildEditTicketPath(getTicketRouteId(ticket))}
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              disabled={isDeleting}
              className="interactive-press"
            >
              Edit Ticket
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlinedIcon />}
              onClick={onDelete}
              disabled={isDeleting}
              className="interactive-press"
            >
              {isDeleting ? 'Deleting…' : 'Delete Ticket'}
            </Button>
          ) : null}
        </Box>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
        {ticket.description}
      </Typography>

      <MetadataGrid>
        <MetadataItem label="Ticket ID" value={formatTicketId(ticket)} />
        <MetadataItem label="Assigned To">
          <TicketUserCell user={ticket.assignedTo} />
        </MetadataItem>
        <MetadataItem label="Created By">
          <TicketUserCell user={ticket.createdBy} unassignedLabel="—" />
        </MetadataItem>
        <MetadataItem label="Created Date" value={formatTicketDate(ticket.createdAt)} />
        <MetadataItem label="Updated Date" value={formatTicketDate(ticket.updatedAt)} />
      </MetadataGrid>
    </Box>
  );
}
