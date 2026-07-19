import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

import { CommentCard } from './CommentCard.jsx';
import { CommentEmptyState } from './CommentEmptyState.jsx';

export const COMMENTS_PAGE_SIZE = 5;

export function CommentList({
  comments = [],
  getCommentProps,
  pageSize = COMMENTS_PAGE_SIZE,
  listKey,
}) {
  const [pagesShown, setPagesShown] = useState(1);

  useEffect(() => {
    setPagesShown(1);
  }, [listKey]);

  useEffect(() => {
    const maxPages = Math.max(1, Math.ceil(comments.length / pageSize));
    setPagesShown((current) => Math.min(current, maxPages));
  }, [comments.length, pageSize]);

  if (comments.length === 0) {
    return <CommentEmptyState />;
  }

  const visibleCount = Math.min(pagesShown * pageSize, comments.length);
  const visibleComments = comments.slice(0, visibleCount);
  const hasMore = comments.length > visibleCount;
  const canSeeLess = pagesShown > 1;
  const showPaginationActions = hasMore || canSeeLess;

  const handleSeeMore = () => {
    setPagesShown((current) => current + 1);
  };

  const handleSeeLess = () => {
    setPagesShown((current) => Math.max(1, current - 1));
  };

  return (
    <Box className="comment-list">
      <Box className="stack-spacing">
        {visibleComments.map((comment) => {
          const props = getCommentProps?.(comment) ?? {
            message: comment.message,
            author: comment.createdBy?.name ?? comment.createdBy?.email,
            createdAtLabel: comment.createdAt,
          };

          return <CommentCard key={comment._id ?? comment.id} {...props} />;
        })}
      </Box>

      {showPaginationActions ? (
        <Box className="comment-list__pagination">
          {canSeeLess ? (
            <Button
              type="button"
              variant="contained"
              onClick={handleSeeLess}
              className="app-btn--gradient-soft interactive-press"
              aria-label="Show fewer comments"
            >
              See less
            </Button>
          ) : null}
          {hasMore ? (
            <Button
              type="button"
              variant="contained"
              onClick={handleSeeMore}
              className="app-btn--submit interactive-press"
              aria-label={`Show more comments (${comments.length - visibleCount} remaining)`}
            >
              See more
            </Button>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}
