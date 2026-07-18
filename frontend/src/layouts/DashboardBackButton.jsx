import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useLocation, useNavigate } from 'react-router-dom';

import { ROUTE_PATHS } from '../constants/routes.constants.js';

export function DashboardBackButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (pathname === ROUTE_PATHS.DASHBOARD) {
    return null;
  }

  return (
    <Tooltip title="Back to Dashboard">
      <IconButton
        aria-label="Back to Dashboard"
        size="small"
        onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}
        sx={{
          color: 'text.secondary',
          ml: -0.5,
          mr: 0.5,
        }}
      >
        <ArrowBackIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
