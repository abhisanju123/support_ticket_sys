import Chip from '@mui/material/Chip';

import { getPriorityChipSx } from '../status/statusColors.js';

export function TicketPriorityChip({ label, priority, size = 'small' }) {
  return (
    <Chip
      label={label}
      size={size}
      variant="outlined"
      sx={getPriorityChipSx(priority, size)}
    />
  );
}
