import { apiSlice } from '../../../api/baseApi.js';
import { unwrapApiResponse } from '../../../utils/apiTransform.js';

import {
  NOTIFICATIONS_TAG,
  notificationInvalidationTags,
  notificationsListTag,
} from './notificationTags.js';

const NOTIFICATIONS_CACHE_SECONDS = 120;

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/notifications',
      transformResponse: unwrapApiResponse,
      providesTags: [notificationsListTag()],
      keepUnusedDataFor: NOTIFICATIONS_CACHE_SECONDS,
    }),

    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      transformResponse: unwrapApiResponse,
      invalidatesTags: notificationInvalidationTags(),
    }),

    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      transformResponse: unwrapApiResponse,
      invalidatesTags: notificationInvalidationTags(),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;

export { NOTIFICATIONS_TAG };

/**
 * Cached notifications — reuses store data instead of refetching on every mount/focus.
 * @param {Parameters<typeof useGetNotificationsQuery>[1]} [options]
 */
export function useCachedNotificationsQuery(options = {}) {
  return useGetNotificationsQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: false,
    ...options,
  });
}
