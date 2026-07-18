import Box from '@mui/material/Box';

import { CommentCard } from './CommentCard.jsx';
import { CommentEmptyState } from './CommentEmptyState.jsx';

export function CommentList({ comments = [], getCommentProps }) {
  if (comments.length === 0) {
    return <CommentEmptyState />;
  }

  return (
    <Box className="stack-spacing">
      {comments.map((comment) => {
        const props = getCommentProps?.(comment) ?? {
          message: comment.message,
          author: comment.createdBy?.name ?? comment.createdBy?.email,
          createdAtLabel: comment.createdAt,
        };

        return <CommentCard key={comment._id} {...props} />;
      })}
    </Box>
  );
}
