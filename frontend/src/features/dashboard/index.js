export {
  dashboardUiReducer,
  selectDashboardStatsRange,
  setStatsRange,
} from './store/dashboardUiSlice.js';

export { DashboardCreationTrendChart } from './components/DashboardCreationTrendChart.jsx';
export { DashboardInsights } from './components/DashboardInsights.jsx';
export { DashboardQuickActions } from './components/DashboardQuickActions.jsx';
export { DashboardRecentTickets } from './components/DashboardRecentTickets.jsx';
export { DashboardStatusBreakdownChart } from './components/DashboardStatusBreakdownChart.jsx';
export { useDashboardStats } from './hooks/useDashboardStats.js';
export { useDashboardTickets } from './hooks/useDashboardTickets.js';
