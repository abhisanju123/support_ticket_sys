import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export function CommentHeader({ author, createdAtLabel, fullDateLabel }) {
  const timestamp = fullDateLabel ? (
    <Tooltip title={fullDateLabel}>
      <Typography component="span" variant="caption" color="text.secondary" sx={{ cursor: 'default' }}>
        {createdAtLabel}
      </Typography>
    </Tooltip>
  ) : (
    <Typography component="span" variant="caption" color="text.secondary">
      {createdAtLabel}
    </Typography>
  );

  return (
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
      {author ? `${author} · ` : ''}
      {timestamp}
    </Typography>
  );
}
