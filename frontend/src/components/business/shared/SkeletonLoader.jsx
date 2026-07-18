import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export function SkeletonLoader({ rows = 3, height = 48 }) {
  return (
    <Box className="stack-spacing" sx={{ width: '100%' }}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={height} />
      ))}
    </Box>
  );
}
