import AddIcon from '@mui/icons-material/Add';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

import { buildTicketsListPath, ROUTE_PATHS } from '../../../constants/routes.constants.js';

export function DashboardQuickActions() {
  return (
    <Box className="inline-spacing" sx={{ flexWrap: 'wrap' }}>
      <Button
        component={RouterLink}
        to={ROUTE_PATHS.CREATE_TICKET}
        variant="contained"
        startIcon={<AddIcon />}
        className="interactive-press"
      >
        Create Ticket
      </Button>

      <Button
        component={RouterLink}
        to={buildTicketsListPath({ status: 'open' })}
        variant="outlined"
        startIcon={<FolderOpenOutlinedIcon />}
        className="interactive-press"
      >
        View Open Tickets
      </Button>
    </Box>
  );
}
