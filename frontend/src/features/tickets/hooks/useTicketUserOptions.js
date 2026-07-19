import { useCachedUsersQuery } from '../../users/api/usersApi.js';

/**
 * Returns internal users for ticket assignment and authorship fields.
 */
export function useTicketUserOptions() {
  const { data: users = [], isLoading, isError } = useCachedUsersQuery();

  return { users, isLoading, isError };
}
