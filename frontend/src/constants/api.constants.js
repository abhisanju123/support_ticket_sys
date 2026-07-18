/**
 * Shared API configuration for RTK Query and HTTP clients.
 * All server requests use VITE_API_BASE_URL + VITE_API_PATH (default /api).
 */

const trimTrailingSlash = (value) => value.replace(/\/$/, '');

const normalizePathPrefix = (value) => {
  if (!value || value === '/') {
    return '';
  }

  return value.startsWith('/') ? value : `/${value}`;
};

const serverOrigin = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000');
const apiPath = normalizePathPrefix(import.meta.env.VITE_API_PATH ?? '/api');

/** Full REST API base URL (origin + /api prefix). */
export const API_BASE_URL = `${serverOrigin}${apiPath}`;

/** Request timeout in milliseconds. */
export const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 30_000;

/** Default headers applied to Axios and RTK Query requests. */
export const DEFAULT_API_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

/** RTK Query cache tag types for Ticket, Comment, and Dashboard endpoints. */
export const API_TAG_TYPES = ['Ticket', 'Comment', 'Dashboard'];

/** Supported HTTP methods for future endpoint definitions. */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};
