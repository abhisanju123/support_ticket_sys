import { apiSlice } from '../../../api/baseApi.js';
import { unwrapApiResponse } from '../../../utils/apiTransform.js';

/** @param {string} ticketId */
export const commentListTag = (ticketId) => ({ type: 'Comment', id: `LIST-${ticketId}` });

/** @param {string} ticketId */
export const commentMutationInvalidationTags = (ticketId) => [
  commentListTag(ticketId),
  { type: 'Ticket', id: ticketId },
  { type: 'Dashboard', id: 'STATS' },
  { type: 'Ticket', id: 'LIST' },
  { type: 'Notification', id: 'COUNT' },
  { type: 'Notification', id: 'LIST' },
];

export const commentCreateInvalidationTags = (ticketId) => commentMutationInvalidationTags(ticketId);

export const commentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query({
      query: ({ ticketId, page, limit, sortBy, sortOrder }) => ({
        url: `/tickets/${ticketId}/comments`,
        params: {
          ...(page != null ? { page } : {}),
          ...(limit != null ? { limit } : {}),
          ...(sortBy ? { sortBy } : {}),
          ...(sortOrder ? { sortOrder } : {}),
        },
      }),
      transformResponse: unwrapApiResponse,
      providesTags: (_result, _error, { ticketId }) => [commentListTag(ticketId)],
    }),

    createComment: builder.mutation({
      query: ({ ticketId, message, createdBy }) => ({
        url: `/tickets/${ticketId}/comments`,
        method: 'POST',
        body: { message, createdBy },
      }),
      transformResponse: unwrapApiResponse,
      invalidatesTags: (_result, _error, { ticketId }) => commentCreateInvalidationTags(ticketId),
    }),

    updateComment: builder.mutation({
      query: ({ ticketId, commentId, message }) => ({
        url: `/tickets/${ticketId}/comments/${commentId}`,
        method: 'PATCH',
        body: { message },
      }),
      transformResponse: unwrapApiResponse,
      invalidatesTags: (_result, _error, { ticketId }) => commentMutationInvalidationTags(ticketId),
    }),

    deleteComment: builder.mutation({
      query: ({ ticketId, commentId }) => ({
        url: `/tickets/${ticketId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      transformResponse: unwrapApiResponse,
      invalidatesTags: (_result, _error, { ticketId }) => commentMutationInvalidationTags(ticketId),
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
