import { apiSlice } from '../../../api/baseApi.js';
import { unwrapApiResponse } from '../../../utils/apiTransform.js';

export const USERS_LIST_TAG = { type: 'User', id: 'LIST' };

const USERS_CACHE_SECONDS = 600;

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: unwrapApiResponse,
      providesTags: [USERS_LIST_TAG],
      keepUnusedDataFor: USERS_CACHE_SECONDS,
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;

/**
 * Cached users list — avoids refetching on every page mount or window focus.
 * @param {Parameters<typeof useGetUsersQuery>[1]} [options]
 */
export function useCachedUsersQuery(options = {}) {
  return useGetUsersQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: false,
    ...options,
  });
}
