import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Outlet, useLocation } from 'react-router-dom';

import { HEADER_HEIGHT_MD, HEADER_HEIGHT_XS } from '../constants/layout.constants.js';
import { ROUTE_PATHS } from '../constants/routes.constants.js';
import { AuthShowcase } from '../features/auth/components/AuthShowcase.jsx';

import { AppHeader } from './AppHeader.jsx';

export function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname === ROUTE_PATHS.REGISTER;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'transparent',
      }}
    >
      <AppHeader guest />

      <Box
        className="auth-layout"
        sx={{
          flex: 1,
          pt: { xs: `${HEADER_HEIGHT_XS}px`, md: `${HEADER_HEIGHT_MD}px` },
        }}
      >
        <AuthShowcase />

        <Box className="auth-layout__form-panel">
          <Box className="auth-layout__form-blob auth-layout__form-blob--one" aria-hidden="true" />
          <Box className="auth-layout__form-blob auth-layout__form-blob--two" aria-hidden="true" />

          <Box className="auth-layout__form-inner">
            <Box className="auth-layout__mobile-hero">
              <Typography component="p" className="auth-layout__mobile-eyebrow">
                {isRegister ? 'Get started' : 'Welcome back'}
              </Typography>
              <Typography component="h2" className="auth-layout__mobile-headline">
                {isRegister ? 'Create your support workspace' : 'Sign in to your workspace'}
              </Typography>
            </Box>

            <Box key={location.pathname} className="page-transition auth-layout__form">
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
