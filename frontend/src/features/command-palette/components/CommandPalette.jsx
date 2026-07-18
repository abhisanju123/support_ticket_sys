import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { buildTicketDetailsPath } from '../../../constants/routes.constants.js';
import { useAppDispatch } from '../../../hooks/index.js';
import { useGetTicketsQuery } from '../../tickets/api/ticketsApi.js';
import { formatTicketId, getTicketRouteId } from '../../tickets/utils/ticketFormatters.js';
import { COMMAND_GROUPS, STATIC_COMMANDS } from '../constants/commandPalette.constants.js';
import { closeCommandPalette } from '../store/commandPaletteSlice.js';

const matchesQuery = (query, command) => {
  const haystack = [command.label, ...(command.keywords ?? [])].join(' ').toLowerCase();
  return haystack.includes(query);
};

/**
 * @param {{ open: boolean; onClose: () => void }} props
 */
export function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');

  const trimmedQuery = query.trim();
  const shouldSearchTickets = trimmedQuery.length >= 2;

  const { data: ticketResults = [], isFetching } = useGetTicketsQuery(
    {
      keyword: trimmedQuery,
      limit: 6,
      page: 1,
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    },
    { skip: !open || !shouldSearchTickets },
  );

  const staticResults = useMemo(() => {
    if (!trimmedQuery) {
      return STATIC_COMMANDS;
    }

    const normalized = trimmedQuery.toLowerCase();
    return STATIC_COMMANDS.filter((command) => matchesQuery(normalized, command));
  }, [trimmedQuery]);

  const handleNavigate = (path) => {
    dispatch(closeCommandPalette());
    setQuery('');
    onClose();
    navigate(path);
  };

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const groupedStatic = staticResults.reduce((groups, command) => {
    const bucket = groups[command.group] ?? [];
    bucket.push(command);
    groups[command.group] = bucket;
    return groups;
  }, {});

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" aria-label="Command palette">
      <DialogContent sx={{ p: 0 }}>
        <TextField
          autoFocus
          fullWidth
          placeholder="Search tickets or jump to a page…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">⌘K</InputAdornment>,
            },
          }}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            borderBottom: 1,
            borderColor: 'divider',
          }}
        />

        <List dense sx={{ maxHeight: 360, overflowY: 'auto', py: 1 }}>
          {Object.entries(groupedStatic).map(([group, commands]) => (
            <li key={group}>
              <Typography variant="overline" sx={{ px: 2, py: 0.5, display: 'block', color: 'text.secondary' }}>
                {group}
              </Typography>
              {commands.map((command) => {
                const Icon = command.icon;

                return (
                  <ListItemButton key={command.id} onClick={() => handleNavigate(command.path)}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={command.label} />
                  </ListItemButton>
                );
              })}
            </li>
          ))}

          {shouldSearchTickets ? (
            <li>
              <Typography variant="overline" sx={{ px: 2, py: 0.5, display: 'block', color: 'text.secondary' }}>
                {COMMAND_GROUPS.TICKETS}
                {isFetching ? ' · searching…' : ''}
              </Typography>
              {ticketResults.length === 0 && !isFetching ? (
                <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
                  No tickets found for &quot;{trimmedQuery}&quot;.
                </Typography>
              ) : null}
              {ticketResults.map((ticket) => (
                <ListItemButton
                  key={ticket._id}
                  onClick={() => handleNavigate(buildTicketDetailsPath(getTicketRouteId(ticket)))}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ConfirmationNumberOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${formatTicketId(ticket)} · ${ticket.title}`}
                    secondary={ticket.status}
                  />
                </ListItemButton>
              ))}
            </li>
          ) : null}
        </List>
      </DialogContent>
    </Dialog>
  );
}
