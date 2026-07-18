import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import {
  ROUTE_PATHS,
  buildTicketDetailsPath,
} from '../constants/routes.constants.js';

/**
 * Builds breadcrumb trail from the current route.
 * @returns {{ label: string, path?: string }[]}
 */
export function useBreadcrumbs() {
  const { pathname } = useLocation();

  return useMemo(() => {
    if (pathname === ROUTE_PATHS.DASHBOARD) {
      return [{ label: 'Dashboard' }];
    }

    if (pathname === ROUTE_PATHS.TICKETS) {
      return [{ label: 'Tickets' }];
    }

    if (pathname === ROUTE_PATHS.CREATE_TICKET) {
      return [
        { label: 'Tickets', path: ROUTE_PATHS.TICKETS },
        { label: 'Create Ticket' },
      ];
    }

    if (pathname === ROUTE_PATHS.SETTINGS) {
      return [{ label: 'Settings' }];
    }

    const editMatch = pathname.match(/^\/tickets\/([^/]+)\/edit$/);
    if (editMatch) {
      const ticketId = editMatch[1];
      return [
        { label: 'Tickets', path: ROUTE_PATHS.TICKETS },
        { label: 'Ticket Details', path: buildTicketDetailsPath(ticketId) },
        { label: 'Edit Ticket' },
      ];
    }

    const detailMatch = pathname.match(/^\/tickets\/([^/]+)$/);
    if (detailMatch && detailMatch[1] !== 'new') {
      return [
        { label: 'Tickets', path: ROUTE_PATHS.TICKETS },
        { label: 'Ticket Details' },
      ];
    }

    return [{ label: 'Dashboard', path: ROUTE_PATHS.DASHBOARD }];
  }, [pathname]);
}
