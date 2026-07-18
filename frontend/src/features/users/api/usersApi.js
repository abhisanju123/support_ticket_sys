import { apiSlice } from '../../../api/baseApi.js';
import { unwrapApiResponse } from '../../../utils/apiTransform.js';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: unwrapApiResponse,
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
