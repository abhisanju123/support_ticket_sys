import Box from '@mui/material/Box';

export function PageContainer({ children, className = '' }) {
  return (
    <Box className={`page-shell stack-spacing ${className}`.trim()}>
      {children}
    </Box>
  );
}
