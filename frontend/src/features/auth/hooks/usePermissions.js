import { useMemo } from 'react';

import { hasPermission, Permission } from '../constants/permissions.js';
import {
  canChangeTicketStatus,
  canCommentOnTicket,
  canCreateTicket,
  canDeleteComment,
  canDeleteTicket,
  canEditComment,
  canEditTicket,
  canViewTicket,
  mustCreateTicketAsSelf,
} from '../utils/ticketAccess.js';
import { useAuth } from './useAuth.js';

export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role;

  return useMemo(
    () => ({
      user,
      role,
      has: (permission) => hasPermission(role, permission),
      canViewDashboard: () => hasPermission(role, Permission.DASHBOARD_VIEW),
      canViewTickets: () => hasPermission(role, Permission.TICKET_VIEW),
      canCreateTicket: () => canCreateTicket(role),
      canEditTicket: (ticket) => canEditTicket(user, ticket),
      canDeleteTicket: () => canDeleteTicket(role),
      canChangeTicketStatus: () => canChangeTicketStatus(role),
      canViewTicket: (ticket) => canViewTicket(user, ticket),
      canCommentOnTicket: (ticket) => canCommentOnTicket(user, ticket),
      canEditComment: (comment) => canEditComment(user, comment),
      canDeleteComment: (comment) => canDeleteComment(user, comment),
      mustCreateTicketAsSelf: () => mustCreateTicketAsSelf(role),
      isEmployee: () => role === 'employee',
      isSupportAgent: () => role === 'support_agent',
      isAdmin: () => role === 'admin',
    }),
    [user, role],
  );
}
