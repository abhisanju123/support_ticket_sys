import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import { ROUTE_PATHS } from '../../../constants/routes.constants.js';

export const COMMAND_GROUPS = {
  NAVIGATION: 'Navigation',
  ACTIONS: 'Actions',
  TICKETS: 'Tickets',
};

/** @type {Array<{ id: string; label: string; path: string; group: string; icon: import('@mui/icons-material').SvgIconComponent; keywords?: string[] }>} */
export const STATIC_COMMANDS = [
  {
    id: 'nav-dashboard',
    label: 'Go to Dashboard',
    path: ROUTE_PATHS.DASHBOARD,
    group: COMMAND_GROUPS.NAVIGATION,
    icon: DashboardOutlinedIcon,
    keywords: ['home', 'overview', 'stats'],
  },
  {
    id: 'nav-tickets',
    label: 'Go to Tickets',
    path: ROUTE_PATHS.TICKETS,
    group: COMMAND_GROUPS.NAVIGATION,
    icon: ConfirmationNumberOutlinedIcon,
    keywords: ['list', 'browse'],
  },
  {
    id: 'action-create-ticket',
    label: 'Create Ticket',
    path: ROUTE_PATHS.CREATE_TICKET,
    group: COMMAND_GROUPS.ACTIONS,
    icon: AddCircleOutlinedIcon,
    keywords: ['new', 'add'],
  },
  {
    id: 'nav-settings',
    label: 'Open Settings',
    path: ROUTE_PATHS.SETTINGS,
    group: COMMAND_GROUPS.NAVIGATION,
    icon: SettingsOutlinedIcon,
    keywords: ['profile', 'theme', 'preferences'],
  },
];
