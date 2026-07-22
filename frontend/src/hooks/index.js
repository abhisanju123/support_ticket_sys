import { useColorScheme } from '@mui/material/styles';
import { useMemo } from 'react';

import { useAppSelector } from '../store/hooks.js';

export { useBreadcrumbs } from './useBreadcrumbs.js';
export { useDebouncedValue } from './useDebouncedValue.js';
export { useAppDispatch, useAppSelector } from '../store/hooks.js';

export const useThemeMode = useColorScheme;

const hasPendingRequest = (entries) =>
  Object.values(entries).some((entry) => entry?.status === 'pending');

export function useGlobalLoading() {
  const queries = useAppSelector((state) => state.api.queries);
  const mutations = useAppSelector((state) => state.api.mutations);

  return useMemo(
    () => hasPendingRequest(queries) || hasPendingRequest(mutations),
    [queries, mutations],
  );
}

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
