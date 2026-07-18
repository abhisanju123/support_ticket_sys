import { Navigate, Outlet } from 'react-router-dom';

import { ROUTE_PATHS } from '../constants/routes.constants.js';
import { selectIsAuthenticated } from '../features/auth/store/authSlice.js';
import { useAppSelector } from '../hooks/index.js';

export function GuestRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.DASHBOARD} replace />;
  }

  return <Outlet />;
}
