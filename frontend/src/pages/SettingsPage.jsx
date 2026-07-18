import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { PageContainer, PageHeader, Panel, SectionCard } from '../components/business';
import { ROUTE_PATHS } from '../constants';
import { useAuth } from '../features/auth/hooks/useAuth.js';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, setMode } = useColorScheme();

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage your profile, appearance, and notification preferences."
      />

      <Box className="stack-spacing">
        <SectionCard>
          <Typography variant="h6" component="h2">
            Profile
          </Typography>
          <Box className="stack-spacing" sx={{ gap: 0.5 }}>
            <Typography variant="body2">
              <strong>Name:</strong> {user?.name ?? '—'}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {user?.email ?? '—'}
            </Typography>
            <Typography variant="body2">
              <strong>Role:</strong> {user?.role ?? '—'}
            </Typography>
          </Box>
        </SectionCard>

        <Panel className="stack-spacing">
          <Typography variant="h6" component="h2">
            Appearance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose how the app looks on this device.
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={mode ?? 'system'}
            onChange={(_event, value) => {
              if (value) {
                setMode(value);
              }
            }}
            aria-label="theme mode"
          >
            <ToggleButton value="light" aria-label="light mode">
              <LightModeOutlinedIcon sx={{ mr: 1 }} fontSize="small" />
              Light
            </ToggleButton>
            <ToggleButton value="dark" aria-label="dark mode">
              <DarkModeOutlinedIcon sx={{ mr: 1 }} fontSize="small" />
              Dark
            </ToggleButton>
            <ToggleButton value="system" aria-label="system mode">
              <SettingsBrightnessOutlinedIcon sx={{ mr: 1 }} fontSize="small" />
              System
            </ToggleButton>
          </ToggleButtonGroup>
        </Panel>

        <Panel className="stack-spacing">
          <Typography variant="h6" component="h2">
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Placeholder preferences until backend notification settings exist.
          </Typography>
          <FormControlLabel control={<Switch defaultChecked disabled />} label="Status change alerts" />
          <FormControlLabel control={<Switch defaultChecked disabled />} label="New comment alerts" />
          <FormControlLabel control={<Switch disabled />} label="Email digests" />
        </Panel>

        <Divider />

        <Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutOutlinedIcon />}
            onClick={handleLogout}
            className="interactive-press"
          >
            Sign out
          </Button>
        </Box>
      </Box>
    </PageContainer>
  );
}
