import Box from '@mui/material/Box';

/**
 * Responsive grid for metadata label/value pairs.
 * @param {{
 *   children: React.ReactNode;
 *   columns?: { xs?: number; sm?: number; md?: number };
 *   className?: string;
 * }} props
 */
export function MetadataGrid({
  children,
  columns = { xs: 1, sm: 2 },
  className = '',
}) {
  return (
    <Box
      className={`metadata-grid ${className}`.trim()}
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: `repeat(${columns.xs ?? 1}, minmax(0, 1fr))`,
          sm: `repeat(${columns.sm ?? 2}, minmax(0, 1fr))`,
          ...(columns.md ? { md: `repeat(${columns.md}, minmax(0, 1fr))` } : {}),
        },
      }}
    >
      {children}
    </Box>
  );
}
