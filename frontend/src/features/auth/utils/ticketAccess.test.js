import { describe, expect, it } from 'vitest';

import { Permission, UserRole, hasPermission } from '../constants/permissions.js';
import {
  canChangeTicketStatus,
  canDeleteComment,
  canDeleteTicket,
  canEditComment,
  canEditTicket,
  canViewTicket,
  filterAssignableUsers,
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
    expect(canEditTicket(admin, { ...ownOpenTicket, status: 'resolved' })).toBe(false);
    expect(canEditTicket(admin, { ...ownOpenTicket, status: 'closed' })).toBe(false);
  });

  it('exposes action helpers by role', () => {
    expect(canDeleteTicket(UserRole.EMPLOYEE)).toBe(false);
    expect(canDeleteTicket(UserRole.ADMIN)).toBe(true);
    expect(canChangeTicketStatus(UserRole.EMPLOYEE)).toBe(false);
    expect(canChangeTicketStatus(UserRole.SUPPORT_AGENT)).toBe(true);
    expect(mustCreateTicketAsSelf(UserRole.EMPLOYEE)).toBe(true);
    expect(mustCreateTicketAsSelf(UserRole.ADMIN)).toBe(false);
  });

  it('filters assignable users to status-capable roles only', () => {
    const users = [
      { _id: '1', role: UserRole.EMPLOYEE, name: 'Employee' },
      { _id: '2', role: UserRole.SUPPORT_AGENT, name: 'Agent' },
      { _id: '3', role: UserRole.ADMIN, name: 'Admin' },
    ];

    expect(filterAssignableUsers(users).map((user) => user._id)).toEqual(['2', '3']);
  });

  it('allows only comment authors to edit and delete comments', () => {
    const ownComment = { createdBy: { _id: 'emp-1' } };
    const foreignComment = { createdBy: { _id: 'other-1' } };

    expect(canEditComment(employee, ownComment)).toBe(true);
    expect(canEditComment(employee, foreignComment)).toBe(false);
    expect(canDeleteComment(employee, ownComment)).toBe(true);
    expect(canDeleteComment(employee, foreignComment)).toBe(false);
    expect(canDeleteComment(admin, foreignComment)).toBe(false);
    expect(canDeleteComment(admin, { createdBy: { _id: 'admin-1' } })).toBe(true);
  });
});
