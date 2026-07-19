/**
 * @param {string | null | undefined} name
 * @returns {string}
 */
export function getUserInitial(name) {
  const trimmed = String(name ?? '').trim();

  if (!trimmed) {
    return '?';
  }

  return trimmed.charAt(0).toUpperCase();
}
