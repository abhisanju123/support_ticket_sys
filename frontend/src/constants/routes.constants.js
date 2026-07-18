/**
 * Application route path constants.
 */

export const ROUTE_PATHS = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  TICKETS: '/tickets',
  CREATE_TICKET: '/tickets/new',
  TICKET_DETAILS: '/tickets/:ticketId',
  EDIT_TICKET: '/tickets/:ticketId/edit',
  LOGIN: '/login',
  REGISTER: '/register',
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
};

export const buildTicketDetailsPath = (ticketId) => `/tickets/${ticketId}`;

export const buildEditTicketPath = (ticketId) => `/tickets/${ticketId}/edit`;

/**
 * @param {{ status?: string }} [options]
 */
export const buildTicketsListPath = ({ status } = {}) => {
  if (!status) {
    return ROUTE_PATHS.TICKETS;
  }

  const params = new URLSearchParams({ status });
  return `${ROUTE_PATHS.TICKETS}?${params.toString()}`;
};
