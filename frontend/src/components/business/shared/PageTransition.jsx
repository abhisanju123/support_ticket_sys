import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';

export function PageTransition({ children }) {
  const location = useLocation();

  return (
    <Box key={location.pathname} className="page-transition">
      {children}
    </Box>
  );
}
