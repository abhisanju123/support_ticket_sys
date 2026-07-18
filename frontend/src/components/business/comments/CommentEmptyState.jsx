import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { CommentsEmptyIllustration } from '../../common/illustrations/CommentsEmptyIllustration.jsx';

export function CommentEmptyState({
  title = 'No comments yet',
  description = 'Be the first to add one.',
}) {
  return (
    <Box className="flex-center stack-spacing" sx={{ py: 3, textAlign: 'center' }}>
      <CommentsEmptyIllustration width={120} height={100} />
      <Box>
        <Typography variant="body2" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
}
