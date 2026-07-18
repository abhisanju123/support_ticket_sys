import Box from '@mui/material/Box';

/**
 * Standard elevated panel used on dashboard, tickets, and detail sections.
 * @param {{
 *   children: React.ReactNode;
 *   flush?: boolean;
 *   fullHeight?: boolean;
 *   className?: string;
 *   component?: React.ElementType;
 * }} props
 */
export function Panel({
  children,
  flush = false,
  fullHeight = false,
  className = '',
  component = 'div',
}) {
  const classes = [
    'app-panel',
    flush ? 'app-panel--flush' : '',
    fullHeight ? 'app-panel--full-height' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Box component={component} className={classes}>
      {children}
    </Box>
  );
}
