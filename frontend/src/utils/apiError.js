/** @typedef {import('@reduxjs/toolkit/query').FetchBaseQueryError} FetchBaseQueryError */

export const API_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

const DEFAULT_STATUS_MESSAGES = {
  400: 'The request could not be processed.',
  401: 'Authentication is required.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This action conflicts with the current state.',
  422: 'Please correct the validation errors and try again.',
  500: 'An unexpected server error occurred. Please try again.',
};

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * @param {unknown} error
 * @returns {error is FetchBaseQueryError}
 */
export const isFetchBaseQueryError = (error) =>
  typeof error === 'object' && error !== null && 'status' in error;

/**
 * Normalizes RTK Query / backend error payloads into a consistent shape.
 * @param {unknown} error
 */
export const parseApiError = (error) => {
  if (!isFetchBaseQueryError(error)) {
    return {
      status: 'UNKNOWN',
      message: 'An unexpected error occurred.',
      code: undefined,
      details: undefined,
      fields: undefined,
    };
  }

  if (error.status === 'FETCH_ERROR') {
    return {
      status: 'FETCH_ERROR',
      message: 'Unable to reach the server. Check your connection and try again.',
      code: 'NETWORK_ERROR',
      details: undefined,
      fields: undefined,
    };
  }

  if (error.status === 'TIMEOUT_ERROR') {
    return {
      status: 'TIMEOUT_ERROR',
      message: 'The request timed out. Please try again.',
      code: 'TIMEOUT_ERROR',
      details: undefined,
      fields: undefined,
    };
  }

  const data = /** @type {{ message?: string; code?: string; details?: Record<string, unknown>; fields?: Record<string, string[]>; status?: number | string; error?: { code?: string; details?: Record<string, unknown> } }} */ (
    error.data ?? {}
  );

  if (data.message && !data.error) {
    return {
      status: data.status ?? error.status,
      message: data.message,
      code: data.code,
      details: data.details,
      fields: data.fields,
    };
  }

  const code = data.error?.code;
  const details = data.error?.details;
  const fields =
    details && typeof details === 'object' && 'fields' in details
      ? /** @type {Record<string, string[]>} */ (details.fields)
      : undefined;

  return {
    status: error.status,
    message:
      data.message ??
      DEFAULT_STATUS_MESSAGES[/** @type {keyof typeof DEFAULT_STATUS_MESSAGES} */ (error.status)] ??
      'Request failed.',
    code,
    details,
    fields,
  };
};

/**
 * @param {number | string} status
 */
const formatErrorStatusPrefix = (status) => {
  if (typeof status === 'number') {
    return `[${status}]`;
  }

  if (status === 'FETCH_ERROR') {
    return '[Network]';
  }

  if (status === 'TIMEOUT_ERROR') {
    return '[Timeout]';
  }

  return '';
};

/**
 * @param {unknown} error
 */
export const getApiErrorMessage = (error) => parseApiError(error).message;

/**
 * Formats API errors for toast notifications with a status prefix when available.
 * @param {unknown} error
 */
export const getApiErrorNotificationMessage = (error) => {
  const { status, message } = parseApiError(error);
  const statusPrefix = formatErrorStatusPrefix(status);

  return statusPrefix ? `${statusPrefix} ${message}` : message;
};

/**
 * @param {unknown} error
 * @returns {Record<string, string[]> | undefined}
 */
export const getValidationFieldErrors = (error) => parseApiError(error).fields;

/**
 * @param {number | string} status
 */
export const shouldRetryRequest = (status) =>
  status === 500 || status === 'FETCH_ERROR' || status === 'TIMEOUT_ERROR';

export { sleep };
