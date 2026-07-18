import { apiSlice } from '../../../api/baseApi.js';
import { unwrapApiResponse } from '../../../utils/apiTransform.js';

import { commentCreateInvalidationTags, commentListTag } from './commentTags.js';

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
  }),
});

export const { useGetCommentsQuery, useCreateCommentMutation } = commentsApi;
