/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isFilledFormValue(value) {
  if (value == null) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

/**
 * @param {Record<string, unknown>} values
 * @param {string[]} requiredFields
 * @returns {boolean}
 */
export function areRequiredFieldsFilled(values, requiredFields) {
  return requiredFields.every((field) => isFilledFormValue(values[field]));
}
