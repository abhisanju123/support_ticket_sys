import Typography from '@mui/material/Typography';

import { getTablePriorityLabelSx } from '../status/statusColors.js';

export function TicketTablePriorityLabel({ label, priority }) {
  return (
    <Typography component="span" variant="body2" sx={getTablePriorityLabelSx(priority)}>
      {label}
    </Typography>
  );
}
