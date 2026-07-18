import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';

import { PageTransition } from '../components/business/shared/PageTransition.jsx';
import { CommandPalette, useCommandPaletteShortcut } from '../features/command-palette/index.js';
import { DRAWER_WIDTH, HEADER_HEIGHT_MD, HEADER_HEIGHT_XS } from '../constants/layout.constants.js';

import { AppBreadcrumbs } from './AppBreadcrumbs.jsx';
import { AppHeader } from './AppHeader.jsx';
import { AppSidebar, AppSidebarPanel } from './AppSidebar.jsx';

export function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open, closePalette } = useCommandPaletteShortcut();

  const handleDrawerToggle = () => {
    setMobileOpen((open) => !open);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppHeader onMenuClick={handleDrawerToggle} />
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={handleDrawerClose}
        isMobile={isMobile}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: `${HEADER_HEIGHT_XS}px`, md: `${HEADER_HEIGHT_MD}px` },
        }}
      >
        <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3, px: { xs: 2, sm: 3 } }}>
          <AppBreadcrumbs />
          <Box
            className="app-layout-body"
            sx={{
              display: { xs: 'block', md: 'grid' },
              gridTemplateColumns: { md: `${DRAWER_WIDTH}px minmax(0, 1fr)` },
              gap: { md: 2 },
              alignItems: 'stretch',
            }}
          >
            {!isMobile ? (
              <Box component="aside" className="app-layout-sidebar">
                <AppSidebarPanel />
              </Box>
            ) : null}
            <Box className="app-layout-content">
              <PageTransition>
                <Outlet />
              </PageTransition>
            </Box>
          </Box>
        </Container>
      </Box>

      <CommandPalette open={open} onClose={closePalette} />
    </Box>
  );
}
