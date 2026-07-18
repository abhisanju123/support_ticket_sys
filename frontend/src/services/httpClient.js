import axios from 'axios';

import { API_BASE_URL, API_TIMEOUT_MS, DEFAULT_API_HEADERS } from '../constants/api.constants.js';

/**
 * Shared Axios instance for ad-hoc HTTP calls outside RTK Query.
 * Server state should prefer RTK Query hooks from api/apiSlice.js.
 */
export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { ...DEFAULT_API_HEADERS },
});

httpClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
