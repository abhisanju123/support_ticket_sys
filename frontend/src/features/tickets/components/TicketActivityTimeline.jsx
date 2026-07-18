import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { SectionCard } from '../../../components/business/shared/SectionCard.jsx';
import { formatRelativeTime, formatTicketDate } from '../utils/ticketFormatters.js';

const ACTIVITY_ICONS = {
  created: FlagOutlinedIcon,
  assigned: AssignmentIndOutlinedIcon,
  status_changed: SwapHorizOutlinedIcon,
  comment_added: AddCommentOutlinedIcon,
};

const ACTIVITY_COLORS = {
  created: 'primary.main',
  assigned: 'secondary.main',
  status_changed: 'warning.main',
  comment_added: 'success.main',
};

/**
 * @param {{ events: Array<{ id: string; type: string; title: string; description: string; timestamp: string | Date }> }} props
 */
export function TicketActivityTimeline({ events = [] }) {
  return (
    <SectionCard>
      <Typography variant="h6" component="h3">
        Activity
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Reconstructed from ticket data and comments until audit logging is available.
      </Typography>

      {events.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          No activity recorded yet.
        </Typography>
      ) : (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {events.map((event, index) => {
            const Icon = ACTIVITY_ICONS[event.type] ?? FiberManualRecordIcon;
            const color = ACTIVITY_COLORS[event.type] ?? 'text.secondary';
            const isLast = index === events.length - 1;

            return (
              <Box
                component="li"
                key={event.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr',
                  gap: 1.5,
                  pb: isLast ? 0 : 2,
                  position: 'relative',
                }}
              >
                {!isLast ? (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 15,
                      top: 28,
                      bottom: 0,
                      width: 2,
                      bgcolor: 'divider',
                    }}
                  />
                ) : null}

                <Box
                  className="flex-center"
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'action.hover',
                    color,
                    zIndex: 1,
                  }}
                >
                  <Icon sx={{ fontSize: 18 }} aria-hidden="true" />
                </Box>

                <Box className="stack-spacing" sx={{ gap: 0.5 }}>
                  <Box className="inline-spacing" sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {event.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      title={formatTicketDate(event.timestamp)}
                    >
                      {formatRelativeTime(event.timestamp)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {event.description}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </SectionCard>
  );
}
