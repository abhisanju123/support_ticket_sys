import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

import { ROUTE_PATHS } from '../../constants/routes.constants.js';

import { NotFoundIllustration } from './illustrations/NotFoundIllustration.jsx';

export function NotFoundState({
  title = 'Page not found',
  description = 'The page you are looking for does not exist or has been moved.',
  actionLabel = 'Go to Dashboard',
  actionPath = ROUTE_PATHS.DASHBOARD,
  illustration = <NotFoundIllustration />,
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
      <Button component={RouterLink} to={actionPath} variant="contained" className="interactive-press">
        {actionLabel}
      </Button>
    </Box>
  );
}
