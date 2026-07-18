import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ROUTE_PATHS } from '../constants/routes.constants.js';
import { selectIsAuthenticated } from '../features/auth/store/authSlice.js';
import { useAppSelector } from '../hooks/index.js';

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
