import { useEffect, useRef, useState } from 'react';

/**
 * Returns a debounced copy of a value.
 * @template T
 * @param {T} value
 * @param {number} [delayMs=400]
 */
export function useDebouncedValue(value, delayMs = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
