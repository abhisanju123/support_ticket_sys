import Box from '@mui/material/Box';

export function SectionCard({ children, className = '', component = 'section' }) {
  return (
    <Box
      component={component}
      className={`surface-card shadow-elevated card-spacing stack-spacing ${className}`.trim()}
    >
      {children}
    </Box>
  );
}
