import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';

import { PaginationComponent } from './TicketToolbar.jsx';
import { TicketTableRow } from './TicketTableRow.jsx';
import { TicketTableSkeleton } from './TicketTableSkeleton.jsx';
import { TABLE_HEADER_CELL_SX } from '../../shared/tableStyles.js';

const headerCellSx = TABLE_HEADER_CELL_SX;

export function TicketTable({
  tickets = [],
  columns = [],
  sortBy,
  sortOrder = 'asc',
  onSort,
  page = 0,
  pageSize = 10,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
  getRowProps,
  useActionMenu = false,
  isLoading = false,
  showSkeleton = false,
  embedded = false,
}) {
  const handleSort = (sortKey) => {
    onSort?.(sortKey);
  };

  const showProgress = isLoading && !showSkeleton;

  return (
    <Box
      className={embedded ? 'ticket-table-embedded' : 'app-panel app-panel--flush'}
      sx={{ overflow: 'hidden', position: 'relative' }}
    >
      {showProgress ? (
        <LinearProgress
          sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}
          aria-label="Loading tickets"
        />
      ) : null}
      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table size="medium" aria-label="Support tickets" className="ticket-table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sortDirection={sortBy === column.sortKey ? sortOrder : false}
                  sx={{
                    ...headerCellSx,
                    display: { xs: column.id === 'updatedAt' ? 'none' : 'table-cell', lg: 'table-cell' },
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.sortKey}
                      direction={sortBy === column.sortKey ? sortOrder : 'asc'}
                      onClick={() => handleSort(column.sortKey)}
                      sx={{
                        '& .MuiTableSortLabel-icon': {
                          opacity: sortBy === column.sortKey ? 1 : 0.35,
                        },
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {showSkeleton ? (
            <TicketTableSkeleton columns={columns} rows={pageSize} />
          ) : (
            <TableBody>
              {tickets.map((ticket, index) => (
                <TicketTableRow
                  key={ticket._id}
                  ticket={ticket}
                  columns={columns}
                  rowIndex={index}
                  useActionMenu={useActionMenu}
                  {...(getRowProps?.(ticket) ?? {})}
                />
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {onPageChange && !showSkeleton ? (
        <Box
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'grey.50',
          }}
        >
          <PaginationComponent
            count={totalCount}
            page={page}
            rowsPerPage={pageSize}
            onPageChange={(_event, newPage) => onPageChange(newPage)}
            onRowsPerPageChange={(event) => onPageSizeChange?.(Number(event.target.value))}
          />
        </Box>
      ) : null}
    </Box>
  );
}
