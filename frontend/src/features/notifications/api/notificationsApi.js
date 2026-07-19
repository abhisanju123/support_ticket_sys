import { apiSlice } from '../../../api/baseApi.js';
import { unwrapApiResponse } from '../../../utils/apiTransform.js';

import {
  NOTIFICATIONS_TAG,
  notificationInvalidationTags,
  notificationsListTag,
} from './notificationTags.js';

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/notifications',
      transformResponse: unwrapApiResponse,
      providesTags: [notificationsListTag()],
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
