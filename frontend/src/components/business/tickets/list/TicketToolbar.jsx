import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

import { RefreshButton } from '../../shared/RefreshButton.jsx';
import { SectionCard } from '../../shared/SectionCard.jsx';
import { getStatusChipSx } from '../status/statusColors.js';

import { TicketSearchBox } from './TicketSearchBox.jsx';
import { TicketStatusFilter } from './TicketStatusFilter.jsx';

export function TicketToolbar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  statusValue,
  statusOptions = [],
  onStatusChange,
  activeFilters = [],
  onClear,
  onRefresh,
  isRefreshing = false,
  embedded = false,
}) {
  const hasActiveFilters = activeFilters.length > 0;

  const content = (
    <>
      <Box className="inline-spacing" sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box className="inline-spacing" sx={{ gap: 1 }}>
          <FilterListIcon color="action" fontSize="small" aria-hidden="true" />
          <Typography variant="subtitle2" fontWeight={600}>
            Filters
          </Typography>
        </Box>

        <Box className="inline-spacing" sx={{ flexShrink: 0 }}>
          {hasActiveFilters && onClear ? (
            <Chip label="Clear all" size="small" variant="outlined" onClick={onClear} onDelete={onClear} />
          ) : null}
          {onRefresh ? (
            <RefreshButton onClick={onRefresh} isLoading={isRefreshing} label="Refresh ticket list" />
          ) : null}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexFlow: 'row',
          alignItems: 'center',
          gap: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <Box sx={{ flex: '1 1 280px', minWidth: 0 }}>
          <TicketSearchBox
            value={searchValue}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
          />
        </Box>

        <Box sx={{ flex: '0 0 200px', width: { xs: '100%', sm: 200 } }}>
          <TicketStatusFilter
            value={statusValue}
            options={statusOptions}
            onChange={onStatusChange}
          />
        </Box>
      </Box>

      {hasActiveFilters ? (
        <Box className="inline-spacing" sx={{ flexWrap: 'wrap', gap: 1 }}>
          {activeFilters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              size="small"
              variant="outlined"
              onDelete={filter.onRemove}
              sx={filter.status ? getStatusChipSx(filter.status, 'small') : undefined}
              color={filter.status ? undefined : 'primary'}
            />
          ))}
        </Box>
      ) : (
        <Typography variant="caption" color="text.secondary">
          Search by title or description and filter by status. Results are loaded from the server.
        </Typography>
      )}
    </>
  );

  if (embedded) {
    return <Box className="stack-spacing">{content}</Box>;
  }

  return <SectionCard className="stack-spacing">{content}</SectionCard>;
}

export function PaginationComponent({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 20, 50],
}) {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={rowsPerPageOptions}
    />
  );
}
