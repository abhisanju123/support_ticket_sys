import { getValidationFieldErrors } from '../apiError.js';

/**
 * Maps backend VALIDATION_ERROR field messages onto React Hook Form fields.
 * @param {unknown} error
 * @param {import('react-hook-form').UseFormSetError<any>} setError
 * @returns {boolean} Whether any field errors were applied
 */
export const applyFieldErrors = (error, setError) => {
  const fields = getValidationFieldErrors(error);

  if (!fields) {
    return false;
  }

  Object.entries(fields).forEach(([field, messages]) => {
    const message = Array.isArray(messages) ? messages[0] : messages;

    if (message) {
      setError(field, { type: 'server', message });
    }
  });

  return Object.keys(fields).length > 0;
};

/** @deprecated Use applyFieldErrors */
export const applyBackendValidationErrors = applyFieldErrors;
