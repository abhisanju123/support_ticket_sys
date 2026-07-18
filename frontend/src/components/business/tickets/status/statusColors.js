/** Distinct colors per ticket status (background, text, border, icon). */
export const STATUS_STYLES = {
  open: {
    bgcolor: '#E3F2FD',
    color: '#0D47A1',
    borderColor: '#64B5F6',
    iconBg: '#1565C0',
    iconColor: '#FFFFFF',
  },
  in_progress: {
    bgcolor: '#FFF8E1',
    color: '#E65100',
    borderColor: '#FFB300',
    iconBg: '#ED6C02',
    iconColor: '#FFFFFF',
  },
  on_hold: {
    bgcolor: '#F3E5F5',
    color: '#6A1B9A',
    borderColor: '#BA68C8',
    iconBg: '#7B1FA2',
    iconColor: '#FFFFFF',
  },
  resolved: {
    bgcolor: '#E8F5E9',
    color: '#1B5E20',
    borderColor: '#66BB6A',
    iconBg: '#2E7D32',
    iconColor: '#FFFFFF',
  },
  closed: {
    bgcolor: '#ECEFF1',
    color: '#37474F',
    borderColor: '#78909C',
    iconBg: '#546E7A',
    iconColor: '#FFFFFF',
  },
  cancelled: {
    bgcolor: '#FFEBEE',
    color: '#B71C1C',
    borderColor: '#EF5350',
    iconBg: '#D32F2F',
    iconColor: '#FFFFFF',
  },
};

/** Distinct styling for the dashboard total summary card. */
export const TOTAL_CARD_STYLE = {
  bgcolor: '#E8EAF6',
  color: '#283593',
  borderColor: '#7986CB',
  iconBg: '#3949AB',
  iconColor: '#FFFFFF',
};

const DEFAULT_STATUS_STYLE = {
  bgcolor: '#F5F5F5',
  color: '#616161',
  borderColor: '#BDBDBD',
  iconBg: '#757575',
  iconColor: '#FFFFFF',
};

export const STATUS_FONT_SIZE = '18px';
export const TABLE_STATUS_FONT_SIZE = '0.875rem';

export const getStatusStyle = (status) => STATUS_STYLES[status] ?? DEFAULT_STATUS_STYLE;

export const getDashboardCardStyle = ({ statusKey, cardKey } = {}) => {
  if (cardKey === 'total') {
    return TOTAL_CARD_STYLE;
  }

  if (statusKey) {
    return getStatusStyle(statusKey);
  }

  return DEFAULT_STATUS_STYLE;
};

const STATUS_CHIP_SIZES = {
  small: {
    fontSize: TABLE_STATUS_FONT_SIZE,
    height: 24,
    labelPx: 1,
  },
  medium: {
    fontSize: STATUS_FONT_SIZE,
    height: 36,
    labelPx: 1.5,
  },
};

/** @param {'small' | 'medium'} size */
export const getStatusChipSx = (status, size = 'small') => {
  const styles = getStatusStyle(status);
  const chipSize = STATUS_CHIP_SIZES[size] ?? STATUS_CHIP_SIZES.small;

  return {
    fontWeight: 600,
    fontSize: chipSize.fontSize,
    height: chipSize.height,
    bgcolor: styles.bgcolor,
    color: styles.color,
    borderColor: styles.borderColor,
    '& .MuiChip-label': {
      px: chipSize.labelPx,
      lineHeight: 1.43,
    },
  };
};

/** @deprecated Use STATUS_STYLES / getStatusChipSx for status badges */
export const STATUS_COLORS = {
  open: 'primary',
  in_progress: 'info',
  on_hold: 'warning',
  resolved: 'success',
  closed: 'default',
  cancelled: 'error',
};

/** @deprecated Use PRIORITY_STYLES / getPriorityChipSx for priority badges */
export const PRIORITY_COLORS = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  critical: 'error',
};

export const PRIORITY_STYLES = {
  low: {
    bgcolor: '#E8F5E9',
    color: '#2E7D32',
    borderColor: '#81C784',
  },
  medium: {
    bgcolor: '#E3F2FD',
    color: '#1565C0',
    borderColor: '#64B5F6',
  },
  high: {
    bgcolor: '#FFF3E0',
    color: '#E65100',
    borderColor: '#FFB74D',
  },
  critical: {
    bgcolor: '#FFEBEE',
    color: '#C62828',
    borderColor: '#EF5350',
  },
};

const DEFAULT_PRIORITY_STYLE = {
  bgcolor: '#F5F5F5',
  color: '#616161',
  borderColor: '#BDBDBD',
};

export const getPriorityStyle = (priority) => PRIORITY_STYLES[priority] ?? DEFAULT_PRIORITY_STYLE;

export const getTableStatusLabelSx = (status) => {
  const styles = getStatusStyle(status);

  return {
    color: styles.color,
    fontWeight: 600,
    fontSize: TABLE_STATUS_FONT_SIZE,
    lineHeight: 1.43,
  };
};

export const getTablePriorityLabelSx = (priority) => {
  const styles = getPriorityStyle(priority);

  return {
    color: styles.color,
    fontWeight: 600,
    fontSize: TABLE_STATUS_FONT_SIZE,
    lineHeight: 1.43,
  };
};

/** @param {'small' | 'medium'} size */
export const getPriorityChipSx = (priority, size = 'small') => {
  const styles = getPriorityStyle(priority);
  const chipSize = STATUS_CHIP_SIZES[size] ?? STATUS_CHIP_SIZES.small;

  return {
    fontWeight: 600,
    fontSize: chipSize.fontSize,
    height: chipSize.height,
    bgcolor: styles.bgcolor,
    color: styles.color,
    borderColor: styles.borderColor,
    '& .MuiChip-label': {
      px: chipSize.labelPx,
      lineHeight: 1.43,
    },
  };
};
