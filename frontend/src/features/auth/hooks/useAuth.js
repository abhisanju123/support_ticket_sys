import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../hooks/index.js';
import { clearCredentials, selectCurrentUser, selectIsAuthenticated } from '../store/authSlice.js';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const logout = useCallback(() => {
    dispatch(clearCredentials());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    logout,
  };
}
