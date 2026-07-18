import Skeleton from '@mui/material/Skeleton';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

const columnVisibility = {
  _id: 'table-cell',
  title: 'table-cell',
  priority: 'table-cell',
  status: 'table-cell',
  assignedTo: 'table-cell',
  createdBy: { xs: 'none', md: 'table-cell' },
  createdAt: 'table-cell',
  updatedAt: { xs: 'none', lg: 'table-cell' },
  actions: 'table-cell',
};

export function TicketTableSkeleton({ columns = [], rows = 8 }) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`}>
          {columns.map((column) => {
            const visibility = columnVisibility[column.id] ?? 'table-cell';
            const width =
              column.id === 'title' ? '70%' : column.id === 'actions' ? 88 : '55%';

            return (
              <TableCell key={column.id} sx={{ display: visibility, py: 1.75 }}>
                <Skeleton variant="rounded" height={22} width={width} />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}
