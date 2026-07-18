import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

export function TicketActionMenu({ actions = [], ariaLabel = 'Ticket actions' }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (actions.length === 0) {
    return null;
  }

  return (
    <>
      <IconButton aria-label={ariaLabel} onClick={handleOpen} size="small">
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {actions.map((action) => (
          <MenuItem
            key={action.id}
            onClick={() => {
              handleClose();
              action.onClick?.();
            }}
            disabled={action.disabled}
          >
            {action.icon ? <ListItemIcon>{action.icon}</ListItemIcon> : null}
            <ListItemText>{action.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
