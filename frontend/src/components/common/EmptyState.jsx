import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function EmptyState({
  title = 'Nothing here yet',
  description = 'There is no data to display.',
  icon: Icon = null,
  illustration = null,
  action = null,
}) {
  return (
    <Box
      className="flex-center stack-spacing"
      role="status"
      sx={{ py: 8, px: 2, textAlign: 'center' }}
    >
      {illustration ? (
        <Box sx={{ lineHeight: 0 }}>{illustration}</Box>
      ) : Icon ? (
        <Box
          className="flex-center"
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            color: 'text.secondary',
          }}
        >
          <Icon fontSize="large" aria-hidden="true" />
        </Box>
      ) : null}

      <Box className="stack-spacing" sx={{ maxWidth: 420 }}>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
      {action}
    </Box>
  );
}
