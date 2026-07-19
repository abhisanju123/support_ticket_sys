import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { buildTicketDetailsPath } from '../../../constants/routes.constants.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { formatRelativeTime } from '../../tickets/utils/ticketFormatters.js';
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationListQuery,
  useUnreadNotificationCountQuery,
} from '../../notifications/index.js';

const TYPE_ICONS = {
  status_changed: SwapHorizOutlinedIcon,
  comment_added: ChatBubbleOutlineOutlinedIcon,
  ticket_updated: EditOutlinedIcon,
};

export function NotificationsMenu() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?._id;
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const { data: unreadCount = 0 } = useUnreadNotificationCountQuery(userId);
  const {
    data: items = [],
    isLoading,
    isFetching,
    refetch,
  } = useNotificationListQuery(userId, isMenuOpen);
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [markAllNotificationsRead] = useMarkAllNotificationsReadMutation();

  useEffect(() => {
    if (isMenuOpen) {
      refetch();
    }
  }, [isMenuOpen, refetch]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = async (item) => {
    try {
      if (!item.read) {
        await markNotificationRead(item._id).unwrap();
      }
    } catch {
      // Navigation still allowed; count will refresh on next poll.
    }

    handleClose();
    navigate(buildTicketDetailsPath(item.ticketNumber));
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead().unwrap();
    } catch {
      // Optimistic update rolls back on failure.
    }
  };

  const showLoading = isMenuOpen && (isLoading || (isFetching && items.length === 0));

  return (
    <>
      <IconButton aria-label="notifications" onClick={handleOpen} color="inherit" className="header-action-btn">
        <Badge badgeContent={unreadCount} color="error" max={9} invisible={unreadCount === 0}>
          <NotificationsNoneOutlinedIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            className: 'notifications-menu',
            sx: { width: 'min(420px, calc(100vw - 1.5rem))', maxWidth: '100%' },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box className="inline-spacing" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
            {unreadCount > 0 ? (
              <Button size="small" onClick={handleMarkAllRead} className="app-btn--gradient-soft interactive-press">
                Mark all read
              </Button>
            ) : null}
          </Box>
        </Box>

        <Divider />

        {showLoading ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 2 }}>
            Loading notifications...
          </Typography>
        ) : items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 2 }}>
            You&apos;re all caught up. New activity will appear here.
          </Typography>
        ) : (
          items.map((item) => {
            const Icon = TYPE_ICONS[item.type] ?? NotificationsNoneOutlinedIcon;

            return (
              <MenuItem
                key={item._id}
                onClick={() => handleSelect(item)}
                className="notifications-menu__item"
                sx={{
                  alignItems: 'flex-start',
                  gap: 1,
                  py: 1.25,
                  px: 2,
                  bgcolor: 'action.hover',
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, mt: 0.35 }}>
                  <Icon fontSize="small" />
                </ListItemIcon>

                <Box className="notifications-menu__content">
                  <Typography variant="body2" className="notifications-menu__message">
                    {item.message}
                  </Typography>
                  <Typography variant="body2" className="notifications-menu__ticket">
                    Ticket #{item.ticketNumber} — {item.ticketTitle}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" className="notifications-menu__time">
                    {formatRelativeTime(item.createdAt)}
                  </Typography>
                </Box>
              </MenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
}
