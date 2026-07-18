import { useDashboardQuery } from '../../tickets/api/ticketsApi.js';

/**
 * Fetches dashboard statistics from the backend API.
 */
export function useDashboardStats() {
  return useDashboardQuery();
}
