import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export function Loader({ message = 'Loading...', size = 40 }) {
  return (
    <Box
      className="flex-center stack-spacing"
      role="status"
      aria-live="polite"
      aria-busy="true"
      sx={{ py: 8, textAlign: 'center' }}
    >
      <CircularProgress size={size} aria-hidden="true" />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
