import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Outlet, useLocation } from 'react-router-dom';

import { APP_TITLE } from '../constants/layout.constants.js';
import { AppLogo } from './AppLogo.jsx';

const PITCH_POINTS = [
  'Track and resolve support requests in one place',
  'Filter, search, and monitor ticket workload',
  'Collaborate with comments and status workflows',
];

export function AuthLayout() {
  const location = useLocation();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          px: 6,
          py: 4,
          background: 'linear-gradient(135deg, #E8EAF6 0%, #E3F2FD 55%, #FFFFFF 100%)',
          borderRight: 1,
          borderColor: 'divider',
        }}
      >
        <AppLogo showLink={false} size={72} showTitle layout="column" />
        <Typography variant="h4" fontWeight={700} sx={{ mt: 4, maxWidth: 420 }}>
          Manage support tickets with clarity and speed
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 460 }}>
          {APP_TITLE} helps teams capture issues, assign ownership, and move work from open to
          resolved without losing context.
        </Typography>
        <Box component="ul" sx={{ mt: 3, pl: 2.5, color: 'text.secondary' }}>
          {PITCH_POINTS.map((point) => (
            <Typography component="li" variant="body2" key={point} sx={{ mb: 1 }}>
              {point}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box
        className="flex-center"
        sx={{
          flex: 1,
          p: { xs: 2, sm: 4 },
          width: { md: 480 },
          maxWidth: '100%',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Box className="flex-center" sx={{ display: { xs: 'flex', md: 'none' }, mb: 3 }}>
            <AppLogo showLink={false} size={64} showTitle layout="column" />
          </Box>

          <Box key={location.pathname} className="page-transition">
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
