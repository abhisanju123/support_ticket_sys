import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../hooks/index.js';
import { clearActivityFeed } from '../../activity/store/activityFeedSlice.js';
import { clearCredentials, selectCurrentUser, selectIsAuthenticated } from '../store/authSlice.js';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const logout = useCallback(() => {
    dispatch(clearCredentials());
    dispatch(clearActivityFeed());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    logout,
  };
}
