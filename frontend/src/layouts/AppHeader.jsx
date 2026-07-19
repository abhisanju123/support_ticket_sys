import { useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha, useTheme } from '@mui/material/styles';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';

import { NotificationsMenu } from '../features/activity/index.js';
import { CommandPaletteTrigger } from '../features/command-palette/components/CommandPaletteTrigger.jsx';
import {
  HEADER_LOGO_SIZE,
  HEADER_HEIGHT_MD,
  HEADER_HEIGHT_XS,
  MOBILE_HEADER_LOGO_SIZE,
} from '../constants/layout.constants.js';
import { ROUTE_PATHS } from '../constants/routes.constants.js';
import { useAuth } from '../features/auth/hooks/useAuth.js';
import { getUserInitial } from '../utils/userFormatters.js';

import { AppLogo } from './AppLogo.jsx';

export function AppHeader({ onMenuClick, guest = false }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, isAuthenticated } = useAuth();
  const [menuAnchor, setMenuAnchor] = useState(null);

  const isGuest = guest || !isAuthenticated;
  const displayName = user?.name ?? 'User';
  const userInitial = getUserInitial(displayName);
  const isLoginPage = location.pathname === ROUTE_PATHS.LOGIN;
  const isRegisterPage = location.pathname === ROUTE_PATHS.REGISTER;

  const handleOpenMenu = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  };

  const handleOpenSettings = () => {
    handleCloseMenu();
    navigate(ROUTE_PATHS.SETTINGS);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      className="app-header"
      sx={{
        width: '100%',
        ml: 0,
        bgcolor: alpha(theme.palette.background.paper, 0.01),
        backdropFilter: 'blur(12px)',
        color: 'text.primary',
        borderBottom: 0,
        boxShadow: 'var(--app-shadow-elevated)',
        zIndex: (appTheme) => appTheme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: { xs: HEADER_HEIGHT_XS, md: HEADER_HEIGHT_MD },
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, md: 2 },
            px: { xs: 2, sm: 3 },
            width: '100%',
          }}
        >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flex: 1,
            minWidth: 0,
          }}
        >
          {isMobile && onMenuClick ? (
            <IconButton
              color="inherit"
              aria-label="open navigation menu"
              edge="start"
              onClick={onMenuClick}
              className="header-action-btn"
            >
              <MenuIcon />
            </IconButton>
          ) : null}

          <AppLogo
            size={isMobile ? MOBILE_HEADER_LOGO_SIZE : HEADER_LOGO_SIZE}
            showTitle
            showLink={!isGuest}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            flexShrink: 0,
          }}
        >
          {isGuest ? (
            <>
              {!isLoginPage ? (
                <Button
                  component={RouterLink}
                  to={ROUTE_PATHS.LOGIN}
                  variant="outlined"
                  size="small"
                  className="interactive-press"
                >
                  Sign in
                </Button>
              ) : null}
              {!isRegisterPage ? (
                <Button
                  component={RouterLink}
                  to={ROUTE_PATHS.REGISTER}
                  variant="contained"
                  size="small"
                  className="app-btn--submit interactive-press"
                >
                  Create account
                </Button>
              ) : null}
            </>
          ) : (
            <>
              <CommandPaletteTrigger />
              <CommandPaletteTrigger compact />

              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  my: 1,
                  mx: 0.25,
                  borderColor: 'divider',
                }}
              />

              <NotificationsMenu />

              <Button
                type="button"
                onClick={handleOpenMenu}
                aria-label="account menu"
                aria-controls={menuAnchor ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuAnchor ? 'true' : undefined}
                className="header-profile-btn interactive-press"
                sx={{
                  ml: 0.25,
                  pl: 0.5,
                  pr: { xs: 0.5, sm: 1 },
                  py: 0.5,
                  minWidth: 0,
                  borderRadius: 2,
                  textTransform: 'none',
                  color: 'text.primary',
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    borderColor: 'divider',
                  },
                }}
              >
                <Avatar
                  className="header-profile-avatar"
                  alt={displayName}
                  sx={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {userInitial}
                </Avatar>

                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left', ml: 1, mr: 0.25 }}>
                  <Typography variant="body2" fontWeight={600} lineHeight={1.2} noWrap>
                    {displayName}
                  </Typography>
                </Box>

                <KeyboardArrowDownIcon
                  fontSize="small"
                  sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.secondary' }}
                />
              </Button>

              <Menu
                id="account-menu"
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      minWidth: 220,
                      borderRadius: 2,
                      border: 1,
                      borderColor: 'divider',
                      boxShadow: 'var(--app-shadow-elevated)',
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {displayName}
                  </Typography>
                </Box>

                <Divider />

                <MenuItem onClick={handleOpenSettings}>
                  <ListItemIcon>
                    <SettingsOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Sign out</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
