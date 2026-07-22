import { useMemo } from 'react';

import {
  DashboardSummary,
  EmptyState,
  ErrorState,
  LoadingSpinner,
  PageContainer,
} from '../components/business';
import { EmptyTicketsIllustration } from '../components/common';
import { buildTicketsListPath } from '../constants/routes.constants.js';
import {
  DashboardInsights,
  DashboardQuickActions,
  DashboardRecentTickets,
} from '../features/dashboard';
import { DASHBOARD_STAT_CARDS } from '../features/dashboard/constants/dashboardStats.constants.js';
import { useDashboardStats, useDashboardTickets } from '../features/dashboard';
import { buildStatusBreakdown } from '../features/dashboard/utils/dashboardChartData.js';
import { getApiErrorMessage } from '../utils';

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboardStats();
  const {
    recentTickets,
    creationTrend,
    isLoading: isTicketsLoading,
    isError: isTicketsError,
    refetch: refetchTickets,
  } = useDashboardTickets();

  const statusSegments = useMemo(() => buildStatusBreakdown(data), [data]);

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard statistics..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        description={getApiErrorMessage(error)}
        onRetry={refetch}
      />
    );
  }

  const items = DASHBOARD_STAT_CARDS.map(({ key, label, cardKey, statusKey, icon }) => ({
    key,
    label,
    value: data?.[key] ?? 0,
    cardKey,
    statusKey,
    icon,
    to: buildTicketsListPath({ status: statusKey }),
  }));

  const hasTickets = (data?.total ?? 0) > 0;

  return (
    <PageContainer>
      <DashboardSummary
        title="Dashboard"
        description="Overview of current ticket workload and status distribution."
        actions={<DashboardQuickActions />}
        items={hasTickets ? items : []}
      >
        {!hasTickets ? (
          <EmptyState
            title="No tickets yet"
            description="Ticket statistics will appear here once support tickets are created."
            illustration={<EmptyTicketsIllustration />}
          />
        ) : null}

        {hasTickets ? <DashboardInsights statusSegments={statusSegments} trendPoints={creationTrend} /> : null}

        <DashboardRecentTickets
          tickets={recentTickets}
          isLoading={isTicketsLoading}
        />

        {isTicketsError ? (
          <ErrorState
            title="Unable to load recent tickets"
            description="Recent ticket activity could not be loaded."
            onRetry={refetchTickets}
          />
        ) : null}
      </DashboardSummary>
    </PageContainer>
  );
}
