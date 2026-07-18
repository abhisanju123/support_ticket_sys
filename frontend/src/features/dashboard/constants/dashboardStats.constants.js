import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import HourglassTopOutlinedIcon from '@mui/icons-material/HourglassTopOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

/**
 * Dashboard stat card definitions mapped to API response fields.
 * @type {Array<{
 *   key: 'total' | 'open' | 'inProgress' | 'resolved' | 'closed' | 'cancelled';
 *   label: string;
 *   cardKey?: 'total';
 *   statusKey?: 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';
 *   icon: import('@mui/icons-material').SvgIconComponent;
 * }>}
 */
export const DASHBOARD_STAT_CARDS = [
  {
    key: 'total',
    label: 'Total Tickets',
    cardKey: 'total',
    icon: ConfirmationNumberOutlinedIcon,
  },
  {
    key: 'open',
    label: 'Open',
    statusKey: 'open',
    icon: FolderOpenOutlinedIcon,
  },
  {
    key: 'inProgress',
    label: 'In Progress',
    statusKey: 'in_progress',
    icon: HourglassTopOutlinedIcon,
  },
  {
    key: 'resolved',
    label: 'Resolved',
    statusKey: 'resolved',
    icon: CheckCircleOutlinedIcon,
  },
  {
    key: 'closed',
    label: 'Closed',
    statusKey: 'closed',
    icon: Inventory2OutlinedIcon,
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    statusKey: 'cancelled',
    icon: CancelOutlinedIcon,
  },
];
