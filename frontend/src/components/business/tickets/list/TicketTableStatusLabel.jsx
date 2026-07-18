import Typography from '@mui/material/Typography';

import { getTableStatusLabelSx } from '../status/statusColors.js';

export function TicketTableStatusLabel({ label, status }) {
  return (
    <Typography component="span" variant="body2" sx={getTableStatusLabelSx(status)}>
      {label}
    </Typography>
  );
}
