import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';

import { ROUTE_PATHS } from './routes.constants.js';

export const APP_TITLE = 'Support Ticket System';

export const DRAWER_WIDTH = 260;
export const SIDEBAR_LOGO_SIZE = 56;
export const HEADER_LOGO_SIZE = 40;
export const MOBILE_HEADER_LOGO_SIZE = 44;
export const HEADER_HEIGHT_XS = 64;
export const HEADER_HEIGHT_MD = 68;

export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: ROUTE_PATHS.DASHBOARD,
    icon: DashboardOutlinedIcon,
    match: (pathname) => pathname === ROUTE_PATHS.DASHBOARD,
  },
  {
    label: 'Tickets',
    path: ROUTE_PATHS.TICKETS,
    icon: ConfirmationNumberOutlinedIcon,
    match: (pathname) => {
      if (pathname === ROUTE_PATHS.CREATE_TICKET) {
        return false;
      }

      return (
        pathname === ROUTE_PATHS.TICKETS ||
        /^\/tickets\/[^/]+(\/edit)?$/.test(pathname)
      );
    },
  },
  {
    label: 'Create Ticket',
    path: ROUTE_PATHS.CREATE_TICKET,
    icon: AddCircleOutlinedIcon,
    match: (pathname) => pathname === ROUTE_PATHS.CREATE_TICKET,
  },
  {
    label: 'Settings',
    path: ROUTE_PATHS.SETTINGS,
    icon: SettingsOutlinedIcon,
    match: (pathname) => pathname === ROUTE_PATHS.SETTINGS,
  },
];

export const PLACEHOLDER_USER = {
  name: 'Support Agent',
  role: 'Employee',
};
