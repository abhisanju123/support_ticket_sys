import { DASHBOARD_STAT_CARDS } from '../constants/dashboardStats.constants.js';

import { DashboardCardGrid } from '../../../components/business/dashboard/DashboardCardGrid.jsx';

export function DashboardStatsGrid({ stats }) {
  const items = DASHBOARD_STAT_CARDS.map(({ key, label, accent, icon }) => ({
    key,
    label,
    value: stats[key],
    accent,
    icon,
  }));

  return <DashboardCardGrid items={items} />;
}
