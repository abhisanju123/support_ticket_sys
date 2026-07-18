import { useMemo } from 'react';

import { useAppSelector } from '../store/hooks.js';

const hasPendingRequest = (entries) =>
  Object.values(entries).some((entry) => entry?.status === 'pending');

/**
 * Returns true while any RTK Query request or mutation is in flight.
 */
export function useGlobalLoading() {
  const queries = useAppSelector((state) => state.api.queries);
  const mutations = useAppSelector((state) => state.api.mutations);

  return useMemo(
    () => hasPendingRequest(queries) || hasPendingRequest(mutations),
    [queries, mutations],
  );
}

/**
 * @param {string} endpointName RTK Query endpoint name (e.g. "getTickets")
 */
export function useEndpointLoading(endpointName) {
  const queries = useAppSelector((state) => state.api.queries);
  const mutations = useAppSelector((state) => state.api.mutations);

  return useMemo(() => {
    const queryPending = Object.values(queries).some(
      (entry) => entry?.endpointName === endpointName && entry?.status === 'pending',
    );
    const mutationPending = Object.values(mutations).some(
      (entry) => entry?.endpointName === endpointName && entry?.status === 'pending',
    );

    return queryPending || mutationPending;
  }, [endpointName, mutations, queries]);
}
