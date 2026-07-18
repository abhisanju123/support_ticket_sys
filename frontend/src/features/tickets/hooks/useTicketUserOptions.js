import { useGetUsersQuery } from '../../users/api/usersApi.js';

/**
 * Returns internal users for ticket assignment and authorship fields.
 */
export function useTicketUserOptions() {
  const { data: users = [], isLoading, isError } = useGetUsersQuery();

  return { users, isLoading, isError };
}
