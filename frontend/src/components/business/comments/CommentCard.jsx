import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { CommentHeader } from './CommentHeader.jsx';

export function CommentCard({ message, author, createdAtLabel, fullDateLabel }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'action.hover',
      }}
    >
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
        {message}
      </Typography>
      <CommentHeader author={author} createdAtLabel={createdAtLabel} fullDateLabel={fullDateLabel} />
    </Box>
  );
}
