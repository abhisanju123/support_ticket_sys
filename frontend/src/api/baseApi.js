import { createApi } from '@reduxjs/toolkit/query/react';

import { API_TAG_TYPES } from '../constants/api.constants.js';

import { baseQuery } from './baseQuery.js';

/**
 * Root RTK Query API slice. Feature modules extend this via injectEndpoints().
 * Server state is cached here — do not duplicate it in feature reducers.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: API_TAG_TYPES,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  keepUnusedDataFor: 60,
  endpoints: () => ({}),
});

/** Alias for baseApi — primary export name for the API slice. */
export const apiSlice = baseApi;
