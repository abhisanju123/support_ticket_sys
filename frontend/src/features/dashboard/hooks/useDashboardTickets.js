import { useMemo } from 'react';

import { useGetTicketsQuery } from '../../tickets/api/ticketsApi.js';
import {
  DASHBOARD_RECENT_TICKET_LIMIT,
  DASHBOARD_TREND_TICKET_SAMPLE_LIMIT,
} from '../constants/dashboardCharts.constants.js';
import { buildCreationTrend } from '../utils/dashboardChartData.js';

export function useDashboardTickets() {
  const query = useGetTicketsQuery({
    page: 1,
    limit: DASHBOARD_TREND_TICKET_SAMPLE_LIMIT,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const recentTickets = useMemo(
    () => (query.data ?? []).slice(0, DASHBOARD_RECENT_TICKET_LIMIT),
    [query.data],
  );

  const creationTrend = useMemo(
    () => buildCreationTrend(query.data ?? []),
    [query.data],
  );

  return {
    ...query,
    recentTickets,
    creationTrend,
  };
}
