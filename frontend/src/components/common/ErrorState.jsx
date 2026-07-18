import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { ErrorIllustration } from './illustrations/ErrorIllustration.jsx';

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry = null,
  retryLabel = 'Try again',
  illustration = <ErrorIllustration />,
}) {
  return (
    <Box
      className="flex-center stack-spacing"
      role="alert"
      sx={{ py: 8, px: 2, textAlign: 'center' }}
    >
      {illustration ? <Box sx={{ lineHeight: 0 }}>{illustration}</Box> : null}
      <Box className="stack-spacing" sx={{ maxWidth: 420 }}>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
      {onRetry ? (
        <Button variant="contained" onClick={onRetry} className="interactive-press">
          {retryLabel}
        </Button>
      ) : null}
    </Box>
  );
}
