import { apiSlice } from '../../../api/baseApi.js';
import { selectCurrentUser } from '../../auth/store/authSlice.js';
import { unwrapApiResponse } from '../../../utils/apiTransform.js';

export const NOTIFICATIONS_TAG = 'Notification';

export const notificationsListTag = () => ({ type: NOTIFICATIONS_TAG, id: 'LIST' });

export const notificationsCountTag = () => ({ type: NOTIFICATIONS_TAG, id: 'COUNT' });

export const notificationInvalidationTags = () => [
  notificationsListTag(),
  notificationsCountTag(),
];

export const notificationCountInvalidationTags = () => [notificationsCountTag()];

const NOTIFICATIONS_CACHE_SECONDS = 120;
const UNREAD_COUNT_POLL_MS = 60_000;

/** RTK Query cache scope — user id is not sent to the API, only separates per-user cache entries. */
function getNotificationCacheScope(getState) {
  return selectCurrentUser(getState())?._id;
}

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUnreadNotificationCount: builder.query({
      query: (_userId) => '/notifications/unread-count',
      transformResponse: (response) => {
        const data = unwrapApiResponse(response);
        return typeof data?.count === 'number' ? data.count : 0;
      },
      providesTags: [notificationsCountTag()],
      keepUnusedDataFor: NOTIFICATIONS_CACHE_SECONDS,
    }),

    getNotifications: builder.query({
      query: (_userId) => '/notifications',
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
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const scope = getNotificationCacheScope(getState);

        if (!scope) {
          return;
        }

        const patchList = dispatch(
          notificationsApi.util.updateQueryData('getNotifications', scope, (draft) => {
            if (!Array.isArray(draft)) {
              return;
            }

            const index = draft.findIndex((item) => item._id === id);

            if (index >= 0) {
              draft.splice(index, 1);
            }
          }),
        );

        const patchCount = dispatch(
          notificationsApi.util.updateQueryData('getUnreadNotificationCount', scope, (count) =>
            Math.max(0, (count ?? 0) - 1),
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchList.undo();
          patchCount.undo();
        }
      },
      invalidatesTags: notificationCountInvalidationTags(),
    }),

    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      transformResponse: unwrapApiResponse,
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        const scope = getNotificationCacheScope(getState);

        if (!scope) {
          return;
        }

        const patchList = dispatch(
          notificationsApi.util.updateQueryData('getNotifications', scope, () => []),
        );

        const patchCount = dispatch(
          notificationsApi.util.updateQueryData('getUnreadNotificationCount', scope, () => 0),
        );

        try {
          await queryFulfilled;
        } catch {
          patchList.undo();
          patchCount.undo();
        }
      },
      invalidatesTags: notificationCountInvalidationTags(),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} = notificationsApi;

export { NOTIFICATIONS_CACHE_SECONDS, UNREAD_COUNT_POLL_MS };

/**
 * Lightweight unread badge query with infrequent background refresh.
 * @param {string | undefined} userId
 * @param {Parameters<typeof useGetUnreadNotificationCountQuery>[1]} [options]
 */
export function useUnreadNotificationCountQuery(userId, options = {}) {
  return useGetUnreadNotificationCountQuery(userId, {
    skip: !userId,
    refetchOnFocus: false,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    pollingInterval: UNREAD_COUNT_POLL_MS,
    ...options,
  });
}

/**
 * Full notification list — fetch only when the bell menu is opened.
 * @param {string | undefined} userId
 * @param {boolean} enabled
 * @param {Parameters<typeof useGetNotificationsQuery>[1]} [options]
 */
export function useNotificationListQuery(userId, enabled = false, options = {}) {
  return useGetNotificationsQuery(userId, {
    skip: !userId || !enabled,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    refetchOnMountOrArgChange: true,
    ...options,
  });
}
