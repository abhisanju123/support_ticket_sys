import { apiSlice } from '../../../api/baseApi.js';
import { unwrapApiResponse } from '../../../utils/apiTransform.js';

import {
  DASHBOARD_STATS_TAG,
  ticketDeleteInvalidationTags,
  ticketDetailTag,
  ticketListTags,
  ticketUpdateInvalidationTags,
  ticketWriteInvalidationTags,
} from './ticketTags.js';

export const ticketsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query({
      query: ({
        keyword,
        status,
        page,
        limit,
        sortBy,
        sortOrder,
      } = {}) => ({
        url: '/tickets',
        params: {
          ...(keyword ? { keyword } : {}),
          ...(status ? { status } : {}),
          ...(page != null ? { page } : {}),
          ...(limit != null ? { limit } : {}),
          ...(sortBy ? { sortBy } : {}),
          ...(sortOrder ? { sortOrder } : {}),
        },
      }),
      transformResponse: unwrapApiResponse,
      providesTags: (result) => ticketListTags(result),
    }),

    getTicketById: builder.query({
      query: (id) => `/tickets/${id}`,
      transformResponse: unwrapApiResponse,
      providesTags: (_result, _error, id) => [ticketDetailTag(id)],
    }),

    getDashboardStats: builder.query({
      query: () => '/tickets/dashboard',
      transformResponse: unwrapApiResponse,
      providesTags: [DASHBOARD_STATS_TAG],
    }),

    createTicket: builder.mutation({
      query: (body) => ({
        url: '/tickets',
        method: 'POST',
        body,
      }),
      transformResponse: unwrapApiResponse,
      invalidatesTags: ticketWriteInvalidationTags,
    }),

    updateTicket: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/tickets/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: unwrapApiResponse,
      invalidatesTags: (_result, _error, { id }) => ticketUpdateInvalidationTags(id),
    }),

    updateTicketStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tickets/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: unwrapApiResponse,
      invalidatesTags: (_result, _error, { id }) => ticketUpdateInvalidationTags(id),
    }),

    deleteTicket: builder.mutation({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: 'DELETE',
      }),
      transformResponse: unwrapApiResponse,
      invalidatesTags: (_result, _error, id) => ticketDeleteInvalidationTags(id),
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useGetDashboardStatsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useUpdateTicketStatusMutation,
  useDeleteTicketMutation,
} = ticketsApi;

/** Alias matching dashboard hook naming convention. */
export const useDashboardQuery = useGetDashboardStatsQuery;
