import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { useAppDispatch, useAppSelector } from '../../../hooks/index.js';
import {
  markActivityRead,
  markAllActivityRead,
  selectActivityFeed,
  selectUnreadActivityCount,
} from '../store/activityFeedSlice.js';
import { formatRelativeTime } from '../../tickets/utils/ticketFormatters.js';

const TYPE_ICONS = {
  status_changed: SwapHorizOutlinedIcon,
  comment_added: ChatBubbleOutlineOutlinedIcon,
};

export function NotificationsMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector(selectActivityFeed);
  const unreadCount = useAppSelector(selectUnreadActivityCount);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (item) => {
    dispatch(markActivityRead(item.id));
    handleClose();

    if (item.path) {
      navigate(item.path);
    }
  };

  const handleMarkAllRead = () => {
    dispatch(markAllActivityRead());
  };

  return (
    <>
      <IconButton aria-label="notifications" onClick={handleOpen} color="inherit" className="header-action-btn">
        <Badge badgeContent={unreadCount} color="error" max={9}>
          <NotificationsNoneOutlinedIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 360, maxWidth: '100%' } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box className="inline-spacing" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
            {unreadCount > 0 ? (
              <Button size="small" onClick={handleMarkAllRead}>
                Mark all read
              </Button>
            ) : null}
          </Box>
        </Box>

        <Divider />

        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 2 }}>
            Activity from status changes and comments will appear here.
          </Typography>
        ) : (
          items.slice(0, 8).map((item) => {
            const Icon = TYPE_ICONS[item.type] ?? NotificationsNoneOutlinedIcon;

            return (
              <MenuItem
                key={item.id}
                onClick={() => handleSelect(item)}
                sx={{ alignItems: 'flex-start', gap: 1, bgcolor: item.read ? 'transparent' : 'action.hover' }}
              >
                <ListItemIcon sx={{ minWidth: 32, mt: 0.25 }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={item.message}
                  secondary={formatRelativeTime(item.timestamp)}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </MenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
}
