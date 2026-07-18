import Typography from '@mui/material/Typography';

import { formatTicketUser } from '../utils/ticketFormatters.js';

/**
 * @param {{ user: { name?: string; email?: string } | string | null | undefined; unassignedLabel?: string }} props
 */
export function TicketUserCell({ user, unassignedLabel = 'Unassigned' }) {
  const label = user ? formatTicketUser(user) : unassignedLabel;

  return (
    <Typography variant="body2" color={user ? 'text.primary' : 'text.secondary'} noWrap>
      {label}
    </Typography>
  );
}
