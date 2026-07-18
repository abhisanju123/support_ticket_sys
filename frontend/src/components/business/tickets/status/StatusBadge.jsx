import Chip from '@mui/material/Chip';

import { getStatusChipSx } from './statusColors.js';

export function StatusBadge({ label, status, size = 'small', sx }) {
  return (
    <Chip
      label={label}
      size={size}
      variant="outlined"
      sx={{
        ...getStatusChipSx(status, size),
        ...sx,
      }}
    />
  );
}
