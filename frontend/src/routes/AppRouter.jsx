import { Navigate, Route, Routes } from 'react-router-dom';

import { ROUTE_PATHS } from '../constants';
import { AuthLayout, MainLayout } from '../layouts';
import {
  CreateTicketPage,
  DashboardPage,
  EditTicketPage,
  LoginPage,
  NotFoundPage,
  RegisterPage,
  SettingsPage,
  TicketDetailsPage,
  TicketsPage,
} from '../pages';
import { GuestRoute } from './GuestRoute.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
          <Route path={ROUTE_PATHS.REGISTER} element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTE_PATHS.HOME} element={<Navigate to={ROUTE_PATHS.DASHBOARD} replace />} />
          <Route path={ROUTE_PATHS.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTE_PATHS.TICKETS} element={<TicketsPage />} />
          <Route path={ROUTE_PATHS.CREATE_TICKET} element={<CreateTicketPage />} />
          <Route path={ROUTE_PATHS.EDIT_TICKET} element={<EditTicketPage />} />
          <Route path={ROUTE_PATHS.TICKET_DETAILS} element={<TicketDetailsPage />} />
          <Route path={ROUTE_PATHS.SETTINGS} element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path={ROUTE_PATHS.NOT_FOUND} element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
