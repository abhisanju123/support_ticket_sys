/**
 * Unwraps the backend success envelope { success, message, data }.
 * @template T
 * @param {{ data?: T }} response
 * @returns {T | undefined}
 */
export const unwrapApiResponse = (response) => response?.data;
