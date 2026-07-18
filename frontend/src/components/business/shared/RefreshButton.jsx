import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export function RefreshButton({ onClick, isLoading = false, label = 'Refresh' }) {
  return (
    <Tooltip title={label}>
      <span>
        <IconButton onClick={onClick} disabled={isLoading} aria-label={label}>
          <RefreshIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
}
