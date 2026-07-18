import { API_ERROR_CODES, parseApiError } from '../apiError.js';

import { applyFieldErrors } from './applyFieldErrors.js';

const FORM_GLOBAL_ERROR_STATUSES = [400, 404, 409, 422, 500];

/**
 * Handles API errors for forms: inline field errors when available, otherwise global alert.
 * @param {unknown} error
 * @param {{
 *   setError: import('react-hook-form').UseFormSetError<any>;
 *   setGlobalError: (message: string | null) => void;
 * }} handlers
 * @returns {{ handled: boolean; type: 'field' | 'global' | 'unhandled' }}
 */
export const handleFormApiError = (error, { setError, setGlobalError }) => {
  const parsed = parseApiError(error);
  const hasFieldErrors = applyFieldErrors(error, setError);

  if (hasFieldErrors) {
    setGlobalError(null);
    return { handled: true, type: 'field' };
  }

  const status = typeof parsed.status === 'number' ? parsed.status : null;
  const isValidationResponse =
    status === 422 || parsed.code === API_ERROR_CODES.VALIDATION_ERROR;

  if (isValidationResponse || (status && FORM_GLOBAL_ERROR_STATUSES.includes(status))) {
    setGlobalError(parsed.message);
    return { handled: true, type: 'global' };
  }

  setGlobalError(parsed.message);
  return { handled: true, type: 'global' };
};
