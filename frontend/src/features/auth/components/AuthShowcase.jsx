import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';

import { APP_TITLE } from '../../../constants/layout.constants.js';
import { ROUTE_PATHS } from '../../../constants/routes.constants.js';
import { AppLogo } from '../../../layouts/AppLogo.jsx';

const FEATURES = [
  {
    icon: AssignmentTurnedInOutlinedIcon,
    title: 'Organized ticketing',
    description: 'Capture requests with priority, ownership, and clear status tracking.',
  },
  {
    icon: SpeedOutlinedIcon,
    title: 'Faster resolution',
    description: 'Filter, search, and prioritize work so nothing slips through the cracks.',
  },
  {
    icon: ForumOutlinedIcon,
    title: 'Team collaboration',
    description: 'Keep context in one place with comments and activity history.',
  },
];

export function AuthShowcase() {
  const location = useLocation();
  const isRegister = location.pathname === ROUTE_PATHS.REGISTER;

  return (
    <Box className="auth-showcase" component="aside" aria-label="Product overview">
      <Box className="auth-showcase__glow auth-showcase__glow--one" aria-hidden="true" />
      <Box className="auth-showcase__glow auth-showcase__glow--two" aria-hidden="true" />
      <Box className="auth-showcase__glow auth-showcase__glow--three" aria-hidden="true" />
      <Box className="auth-showcase__grid" aria-hidden="true" />
      <Box className="auth-showcase__orb auth-showcase__orb--one" aria-hidden="true" />
      <Box className="auth-showcase__orb auth-showcase__orb--two" aria-hidden="true" />

      <Box className="auth-showcase__content">
        <Box className="auth-showcase__brand">
          <AppLogo showLink={false} size={52} showTitle tone="light" />
        </Box>

        <Typography component="p" className="auth-showcase__eyebrow">
          {isRegister ? 'Create your workspace' : 'Welcome back'}
        </Typography>

        <Typography component="h1" className="auth-showcase__headline">
          {isRegister
            ? 'Start managing support tickets in minutes'
            : 'Support operations, simplified'}
        </Typography>

        <Typography className="auth-showcase__lead">
          {APP_TITLE} helps teams move from open issues to resolved outcomes with role-based
          access, live dashboards, and streamlined ticket workflows.
        </Typography>

        <Box className="auth-showcase__features">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Box key={title} className="auth-showcase__feature">
              <Box className="auth-showcase__feature-icon" aria-hidden="true">
                <Icon fontSize="small" />
              </Box>
              <Box className="auth-showcase__feature-body">
                <Typography component="h2" className="auth-showcase__feature-title">
                  {title}
                </Typography>
                <Typography className="auth-showcase__feature-copy">{description}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
