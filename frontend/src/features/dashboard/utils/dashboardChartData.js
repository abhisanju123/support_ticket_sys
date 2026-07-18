import { getStatusStyle } from '../../../components/business/tickets/status/statusColors.js';
import {
  DASHBOARD_CHART_STATUSES,
  DASHBOARD_TREND_DAY_COUNT,
} from '../constants/dashboardCharts.constants.js';

/**
 * @param {Record<string, number> | null | undefined} stats
 */
export function buildStatusBreakdown(stats) {
  if (!stats) {
    return [];
  }

  return DASHBOARD_CHART_STATUSES.map(({ statsKey, statusKey, label }) => ({
    statusKey,
    label,
    value: Number(stats[statsKey] ?? 0),
    color: getStatusStyle(statusKey).iconBg,
  }));
}

/**
 * Groups ticket creation dates into daily counts for the last N days.
 * @param {Array<{ createdAt?: string | Date }>} tickets
 * @param {number} [dayCount]
 */
export function buildCreationTrend(tickets = [], dayCount = DASHBOARD_TREND_DAY_COUNT) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (dayCount - 1 - index));
    return date;
  });

  const counts = new Map(days.map((date) => [date.toDateString(), 0]));

  tickets.forEach((ticket) => {
    if (!ticket?.createdAt) {
      return;
    }

    const createdDate = new Date(ticket.createdAt);
    createdDate.setHours(0, 0, 0, 0);
    const key = createdDate.toDateString();

    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  });

  return days.map((date) => ({
    date,
    label: date.toLocaleDateString(undefined, { weekday: 'short' }),
    shortLabel: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    count: counts.get(date.toDateString()) ?? 0,
  }));
}

/**
 * Builds a conic-gradient stop list for the status donut chart.
 * @param {Array<{ value: number; color: string }>} segments
 */
export function buildConicGradient(segments) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  if (total === 0) {
    return 'conic-gradient(#E0E0E0 0deg 360deg)';
  }

  let currentPercent = 0;

  return `conic-gradient(${segments
    .filter((segment) => segment.value > 0)
    .map((segment) => {
      const start = currentPercent;
      const slice = (segment.value / total) * 100;
      currentPercent += slice;
      return `${segment.color} ${start}% ${currentPercent}%`;
    })
    .join(', ')})`;
}
