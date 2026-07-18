import Grid from '@mui/material/Grid';

import { DashboardCard } from './DashboardCard.jsx';

export function DashboardCardGrid({ items = [] }) {
  return (
    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
      {items.map((item) => (
        <Grid key={item.key ?? item.label} size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardCard
            label={item.label}
            value={item.value}
            cardKey={item.cardKey}
            statusKey={item.statusKey}
            icon={item.icon}
            to={item.to}
          />
        </Grid>
      ))}
    </Grid>
  );
}
