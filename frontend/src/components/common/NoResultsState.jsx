import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { SearchIllustration } from './illustrations/SearchIllustration.jsx';

export function NoResultsState({
  title = 'No results found',
  description = 'Try adjusting your search or filters.',
  query = null,
  onClear = null,
  clearLabel = 'Clear filters',
  illustration = <SearchIllustration />,
}) {
  const message =
    query && query.trim().length > 0
      ? `No results found for "${query}". Try a different keyword.`
      : description;

  return (
    <Box
      className="flex-center stack-spacing"
      role="status"
      sx={{ py: 8, px: 2, textAlign: 'center' }}
    >
      {illustration ? <Box sx={{ lineHeight: 0 }}>{illustration}</Box> : null}
      <Box className="stack-spacing" sx={{ maxWidth: 420 }}>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
      {onClear ? (
        <Button variant="outlined" onClick={onClear} className="interactive-press">
          {clearLabel}
        </Button>
      ) : null}
    </Box>
  );
}
