import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { NavLink, useLocation } from 'react-router-dom';

import {
  DRAWER_WIDTH,
  HEADER_HEIGHT_XS,
  NAV_ITEMS,
} from '../constants/layout.constants.js';

function SidebarNavItem({ label, path, icon: Icon, isActive, onNavigate }) {
  return (
    <ListItemButton
      component={NavLink}
      to={path}
      onClick={() => onNavigate?.()}
      selected={isActive}
      className="app-sidebar-nav-item"
    >
      <ListItemIcon>
        <Box className="app-sidebar-nav-icon">
          <Icon fontSize="small" />
        </Box>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}

function SidebarNav({ onNavigate }) {
  const { pathname } = useLocation();

  return (
    <Box component="section" aria-label="Main navigation">
      <List component="nav" className="app-sidebar__nav" disablePadding>
        {NAV_ITEMS.map(({ label, path, icon, match }) => (
          <SidebarNavItem
            key={path}
            label={label}
            path={path}
            icon={icon}
            isActive={match(pathname)}
            onNavigate={onNavigate}
          />
        ))}
      </List>
    </Box>
  );
}

export function AppSidebarPanel({ onNavigate, className = '', fullHeight = false }) {
  return (
    <Box
      className={`app-sidebar__panel app-panel shadow-elevated${fullHeight ? ' app-sidebar__panel--full' : ''} ${className}`.trim()}
    >
      <SidebarNav onNavigate={onNavigate} />
    </Box>
  );
}

const mobileDrawerPaperSx = {
  width: DRAWER_WIDTH,
  boxSizing: 'border-box',
  top: HEADER_HEIGHT_XS,
  height: `calc(100% - ${HEADER_HEIGHT_XS}px)`,
};

export function AppSidebar({ mobileOpen, onMobileClose, isMobile }) {
  if (!isMobile) {
    return null;
  }

  return (
    <Drawer
      className="app-sidebar"
      variant="temporary"
      open={mobileOpen}
      onClose={onMobileClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': mobileDrawerPaperSx,
      }}
    >
      <Box className="app-sidebar__mobile-shell">
        <AppSidebarPanel onNavigate={onMobileClose} fullHeight />
      </Box>
    </Drawer>
  );
}
