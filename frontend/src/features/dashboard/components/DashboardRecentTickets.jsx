import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import {
  getTableRowSx,
  TABLE_BODY_CELL_SX,
  TABLE_HEADER_CELL_SX,
} from '../../../components/business/shared/tableStyles.js';
import { TicketTablePriorityLabel } from '../../../components/business/tickets/list/TicketTablePriorityLabel.jsx';
import { TicketTableStatusLabel } from '../../../components/business/tickets/list/TicketTableStatusLabel.jsx';
import { buildTicketDetailsPath, ROUTE_PATHS } from '../../../constants/routes.constants.js';
import {
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
} from '../../tickets/constants/ticket.constants.js';
import { formatTicketId, formatTicketTableDate, getTicketRouteId } from '../../tickets/utils/ticketFormatters.js';

const headerCellSx = TABLE_HEADER_CELL_SX;
const bodyCellSx = TABLE_BODY_CELL_SX;

/**
 * @param {{
 *   tickets?: Array<Record<string, any>>;
 *   isLoading?: boolean;
 * }} props
 */
export function DashboardRecentTickets({ tickets = [], isLoading = false }) {
  const navigate = useNavigate();

  return (
    <Box className="app-panel stack-spacing">
      <Box className="inline-spacing" sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h6" component="h3" fontWeight={600}>
            Recent Tickets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Latest tickets created in the system
          </Typography>
        </Box>

        <Button component={RouterLink} to={ROUTE_PATHS.TICKETS} size="small" className="interactive-press">
          View all
        </Button>
      </Box>

      <Box className="ticket-table-embedded" sx={{ overflowX: 'auto' }}>
        <Table size="small" className="ticket-table">
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx}>ID</TableCell>
              <TableCell sx={headerCellSx}>Title</TableCell>
              <TableCell sx={headerCellSx}>Status</TableCell>
              <TableCell sx={headerCellSx}>Priority</TableCell>
              <TableCell sx={headerCellSx}>Created</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array.from({ length: 5 }).map((__, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}

            {!isLoading && tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent tickets to show.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}

            {!isLoading
              ? tickets.map((ticket, index) => (
                  <TableRow
                    key={ticket._id}
                    hover
                    sx={getTableRowSx(index, { clickable: true })}
                    onClick={() => navigate(buildTicketDetailsPath(getTicketRouteId(ticket)))}
                  >
                    <TableCell sx={{ ...bodyCellSx, fontWeight: 600 }}>{formatTicketId(ticket)}</TableCell>
                    <TableCell sx={{ ...bodyCellSx, maxWidth: 280 }}>
                      <Typography variant="body2" className="truncate-text">
                        {ticket.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={bodyCellSx}>
                      <TicketTableStatusLabel
                        label={TICKET_STATUS_LABELS[ticket.status] ?? ticket.status}
                        status={ticket.status}
                      />
                    </TableCell>
                    <TableCell sx={bodyCellSx}>
                      <TicketTablePriorityLabel
                        label={TICKET_PRIORITY_LABELS[ticket.priority] ?? ticket.priority}
                        priority={ticket.priority}
                      />
                    </TableCell>
                    <TableCell sx={bodyCellSx}>{formatTicketTableDate(ticket.createdAt)}</TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
