import { useCallback, useState } from 'react';

/**
 * Manages a form-level error message (e.g. API 400/404/409/500 responses).
 */
export function useFormGlobalError() {
  const [globalError, setGlobalError] = useState(null);

  const clearGlobalError = useCallback(() => {
    setGlobalError(null);
  }, []);

  return {
    globalError,
    setGlobalError,
    clearGlobalError,
  };
}
