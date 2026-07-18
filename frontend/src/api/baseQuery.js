import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_BASE_URL, API_TIMEOUT_MS, DEFAULT_API_HEADERS } from '../constants/api.constants.js';
import { selectAuthToken } from '../features/auth/store/authSlice.js';
import { parseApiError, shouldRetryRequest, sleep } from '../utils/apiError.js';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  prepareHeaders: (headers, { getState }) => {
    Object.entries(DEFAULT_API_HEADERS).forEach(([key, value]) => {
      headers.set(key, value);
    });

    const token = selectAuthToken(getState());

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

/**
 * RTK Query base query with retry and normalized error payloads.
 * Supports GET, POST, PUT, PATCH, DELETE via endpoint builders.
 */
export const baseQuery = async (args, api, extraOptions = {}) => {
  const maxRetries = extraOptions.maxRetries ?? MAX_RETRIES;
  let attempt = 0;

  while (true) {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (!result.error) {
      return result;
    }

    const { status } = result.error;

    if (shouldRetryRequest(status) && attempt < maxRetries) {
      attempt += 1;
      await sleep(RETRY_DELAY_MS * attempt);
      continue;
    }

    return {
      error: {
        ...result.error,
        data: parseApiError(result.error),
      },
    };
  }
};
