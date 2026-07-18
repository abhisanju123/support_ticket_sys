import Grid from '@mui/material/Grid';

import { DashboardCreationTrendChart } from './DashboardCreationTrendChart.jsx';
import { DashboardStatusBreakdownChart } from './DashboardStatusBreakdownChart.jsx';

/**
 * @param {{
 *   statusSegments: Array<{ label: string; value: number; color: string; statusKey?: string }>;
 *   trendPoints: Array<{ label: string; shortLabel: string; count: number }>;
 * }} props
 */
export function DashboardInsights({ statusSegments, trendPoints }) {
  return (
    <Grid container spacing={{ xs: 2, md: 2.5 }}>
      <Grid size={{ xs: 12, lg: 5 }}>
        <DashboardStatusBreakdownChart segments={statusSegments} />
      </Grid>

      <Grid size={{ xs: 12, lg: 7 }}>
        <DashboardCreationTrendChart points={trendPoints} />
      </Grid>
    </Grid>
  );
}
