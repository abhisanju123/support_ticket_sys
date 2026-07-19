/** Shared MUI `sx` presets for data tables across the app. */

export const TABLE_HEADER_CELL_SX = {
  fontWeight: 600,
  fontSize: '0.8125rem',
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  background: 'var(--app-color-table-header)',
  borderBottom: 1,
  borderColor: 'divider',
  py: 1.5,
  whiteSpace: 'nowrap',
};

export const TABLE_BODY_CELL_SX = {
  py: 1.75,
  borderBottom: 1,
  borderColor: 'divider',
  verticalAlign: 'middle',
};

/**
 * @param {number} rowIndex
 * @param {{ clickable?: boolean }} [options]
 */
export const getTableRowSx = (rowIndex, { clickable = false } = {}) => ({
  bgcolor: rowIndex % 2 === 0 ? 'background.paper' : 'var(--app-color-table-row-alt)',
  '&:last-child td': { borderBottom: 0 },
  transition: 'background-color 0.15s ease',
  cursor: clickable ? 'pointer' : 'default',
  ...(clickable
    ? {
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }
    : {}),
});
