import { apiSlice } from '../../../api/baseApi.js';
import { unwrapApiResponse } from '../../../utils/apiTransform.js';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: unwrapApiResponse,
    }),

    register: builder.mutation({
      query: ({ name, email, password }) => ({
        url: '/auth/register',
        method: 'POST',
        body: { name, email, password },
      }),
      transformResponse: unwrapApiResponse,
    }),

    getCurrentUser: builder.query({
      query: () => '/auth/me',
      transformResponse: unwrapApiResponse,
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery } = authApi;
