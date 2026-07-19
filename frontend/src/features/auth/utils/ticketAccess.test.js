import { describe, expect, it } from 'vitest';

import { Permission, UserRole, hasPermission } from '../constants/permissions.js';
import {
  canChangeTicketStatus,
  canDeleteTicket,
  canEditTicket,
  canViewTicket,
  mustCreateTicketAsSelf,
} from '../utils/ticketAccess.js';

describe('frontend permissions', () => {
  const employee = { _id: 'emp-1', role: UserRole.EMPLOYEE };
  const admin = { _id: 'admin-1', role: UserRole.ADMIN };

  const ownOpenTicket = {
    status: 'open',
    createdBy: { _id: 'emp-1' },
    assignedTo: null,
  };

  const foreignTicket = {
    status: 'open',
    createdBy: { _id: 'other-1' },
    assignedTo: null,
  };

  it('maps role permissions consistently with backend', () => {
    expect(hasPermission(UserRole.EMPLOYEE, Permission.TICKET_DELETE)).toBe(false);
    expect(hasPermission(UserRole.ADMIN, Permission.TICKET_DELETE)).toBe(true);
  });

  it('scopes employee ticket visibility', () => {
    expect(canViewTicket(employee, ownOpenTicket)).toBe(true);
    expect(canViewTicket(employee, foreignTicket)).toBe(false);
    expect(canViewTicket(admin, foreignTicket)).toBe(true);
  });

  it('limits employee edits to own tickets', () => {
    expect(canEditTicket(employee, ownOpenTicket)).toBe(true);
    expect(canEditTicket(employee, foreignTicket)).toBe(false);
    expect(canEditTicket(admin, foreignTicket)).toBe(true);
  });

  it('exposes action helpers by role', () => {
    expect(canDeleteTicket(UserRole.EMPLOYEE)).toBe(false);
    expect(canDeleteTicket(UserRole.ADMIN)).toBe(true);
    expect(canChangeTicketStatus(UserRole.EMPLOYEE)).toBe(false);
    expect(canChangeTicketStatus(UserRole.SUPPORT_AGENT)).toBe(true);
    expect(mustCreateTicketAsSelf(UserRole.EMPLOYEE)).toBe(true);
    expect(mustCreateTicketAsSelf(UserRole.ADMIN)).toBe(false);
  });
});
