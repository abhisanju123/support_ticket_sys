import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

import { getDashboardCardStyle } from '../tickets/status/statusColors.js';

const DASHBOARD_CARD_LABEL_SIZE = '0.9375rem';
const DASHBOARD_CARD_VALUE_SIZE = '1.125rem';

export function StatisticsCard({ label, value, icon: Icon, statusKey, cardKey, to }) {
  const formattedValue = Number(value ?? 0).toLocaleString();
  const cardStyle = getDashboardCardStyle({ statusKey, cardKey });
  const contentColor = cardStyle.color;

  const content = (
    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Box className="inline-spacing" sx={{ justifyContent: 'space-between', mb: 1 }}>
        <Typography
          fontWeight={600}
          sx={{
            fontSize: DASHBOARD_CARD_LABEL_SIZE,
            color: contentColor,
          }}
        >
          {label}
        </Typography>
        {Icon ? (
          <Box
            className="dashboard-stat-card__icon flex-center"
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              background: cardStyle.iconBackground ?? cardStyle.iconBg,
              color: cardStyle.iconColor,
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.14)',
            }}
          >
            <Icon sx={{ fontSize: 18 }} aria-hidden="true" />
          </Box>
        ) : null}
      </Box>

      <Typography
        component="p"
        fontWeight={700}
        sx={{
          fontSize: DASHBOARD_CARD_VALUE_SIZE,
          lineHeight: 1.2,
          color: contentColor,
        }}
      >
        {formattedValue}
      </Typography>
    </CardContent>
  );

  return (
    <Card
      className="dashboard-stat-card surface-card h-full"
      elevation={0}
      sx={{
        background: cardStyle.background ?? cardStyle.bgcolor,
        borderColor: cardStyle.borderColor,
      }}
    >
      {to ? (
        <CardActionArea
          component={RouterLink}
          to={to}
          aria-label={`View ${label.toLowerCase()} tickets`}
          sx={{ height: '100%' }}
        >
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
}

