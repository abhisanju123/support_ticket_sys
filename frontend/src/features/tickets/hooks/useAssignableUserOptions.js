import { useMemo } from 'react';

import { filterAssignableUsers } from '../../auth/utils/ticketAccess.js';
import { useCachedUsersQuery } from '../../users/api/usersApi.js';

/**
 * Returns users who can be assigned tickets (support agents and admins).
 */
export function useAssignableUserOptions() {
  const { data: users = [], isLoading, isError } = useCachedUsersQuery();
  const assignableUsers = useMemo(() => filterAssignableUsers(users), [users]);

  return { users: assignableUsers, isLoading, isError };
}
