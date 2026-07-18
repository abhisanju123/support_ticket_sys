import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useAppDispatch } from '../../../hooks/index.js';
import { openCommandPalette } from '../store/commandPaletteSlice.js';

/**
 * @param {{ compact?: boolean }} props
 */
export function CommandPaletteTrigger({ compact = false }) {
  const dispatch = useAppDispatch();

  const handleOpen = () => {
    dispatch(openCommandPalette());
  };

  if (compact) {
    return (
      <Tooltip title="Search (Ctrl+K)">
        <IconButton
          aria-label="Open search"
          onClick={handleOpen}
          size="small"
          className="header-action-btn"
          sx={{ display: { xs: 'inline-flex', lg: 'none' } }}
        >
          <SearchIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button
      type="button"
      variant="outlined"
      onClick={handleOpen}
      startIcon={<SearchIcon fontSize="small" />}
      className="header-search-trigger interactive-press"
      sx={{
        display: { xs: 'none', lg: 'inline-flex' },
        color: 'text.secondary',
        borderColor: 'divider',
        bgcolor: 'action.hover',
        textTransform: 'none',
        fontWeight: 500,
        minWidth: 220,
        justifyContent: 'flex-start',
        px: 1.5,
        py: 0.75,
        borderRadius: 2,
        '&:hover': {
          bgcolor: 'action.selected',
          borderColor: 'divider',
        },
      }}
    >
      <Box component="span" sx={{ flex: 1, textAlign: 'left' }}>
        Search tickets, pages…
      </Box>
      <Chip
        label="Ctrl+K"
        size="small"
        sx={{
          height: 22,
          fontSize: '0.6875rem',
          fontWeight: 600,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
        }}
      />
    </Button>
  );
}
