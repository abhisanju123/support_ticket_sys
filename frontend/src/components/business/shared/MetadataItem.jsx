import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * Label/value field for detail views and summary panels.
 * @param {{ label: string; value?: React.ReactNode; children?: React.ReactNode }} props
 */
export function MetadataItem({ label, value, children }) {
  return (
    <Box className="metadata-item">
      <Typography component="span" className="metadata-item__label">
        {label}
      </Typography>
      <Box className="metadata-item__value">
        {children ?? <Typography variant="body2">{value ?? '—'}</Typography>}
      </Box>
    </Box>
  );
}
