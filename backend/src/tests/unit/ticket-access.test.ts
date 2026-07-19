import { Types } from 'mongoose';

import {
  assertCanDeleteComment,
  assertCanEditComment,
  assertCanEditTicket,
  assertEmployeeCreatesOwnTicket,
  assertTicketVisible,
  getTicketListScope,
  isTicketAccessibleToUser,
} from '../../authorization/ticket-access.js';
import { TicketStatus } from '../../enums/ticket-status.enum.js';
import { UserRole } from '../../enums/user-role.enum.js';
import { ForbiddenException, NotFoundException } from '../../exceptions/index.js';
import type { AuthenticatedUser } from '../../types/auth.types.js';

const employeeId = '507f1f77bcf86cd799439011';
const otherUserId = '507f1f77bcf86cd799439012';

const employeeUser: AuthenticatedUser = {
  id: employeeId,
  email: 'employee@example.com',
  role: UserRole.EMPLOYEE,
};

const adminUser: AuthenticatedUser = {
  id: otherUserId,
  email: 'admin@example.com',
  role: UserRole.ADMIN,
};

describe('ticket-access', () => {
  const ownTicket = {
    createdBy: new Types.ObjectId(employeeId),
    assignedTo: null,
    status: TicketStatus.OPEN,
  };

  const assignedTicket = {
    createdBy: new Types.ObjectId(otherUserId),
    assignedTo: new Types.ObjectId(employeeId),
    status: TicketStatus.OPEN,
  };

  const foreignTicket = {
    createdBy: new Types.ObjectId(otherUserId),
    assignedTo: null,
    status: TicketStatus.OPEN,
  };

  it('identifies tickets visible to an employee', () => {
    expect(isTicketAccessibleToUser(ownTicket, employeeId)).toBe(true);
    expect(isTicketAccessibleToUser(assignedTicket, employeeId)).toBe(true);
    expect(isTicketAccessibleToUser(foreignTicket, employeeId)).toBe(false);
  });

  it('hides foreign tickets from employees with 404', () => {
    expect(() => assertTicketVisible(employeeUser, foreignTicket)).toThrow(NotFoundException);
    expect(() => assertTicketVisible(employeeUser, ownTicket)).not.toThrow();
  });

  it('allows admins to view any ticket', () => {
    expect(() => assertTicketVisible(adminUser, foreignTicket)).not.toThrow();
  });

  it('restricts employees to editing their own open tickets', () => {
    expect(() => assertCanEditTicket(employeeUser, ownTicket)).not.toThrow();
    expect(() => assertCanEditTicket(employeeUser, assignedTicket)).toThrow(ForbiddenException);
    expect(() =>
      assertCanEditTicket(employeeUser, { ...ownTicket, status: TicketStatus.RESOLVED }),
    ).toThrow(ForbiddenException);
    expect(() =>
      assertCanEditTicket(employeeUser, { ...ownTicket, status: TicketStatus.CLOSED }),
    ).toThrow(ForbiddenException);
    expect(() =>
      assertCanEditTicket(employeeUser, { ...ownTicket, status: TicketStatus.CANCELLED }),
    ).toThrow(ForbiddenException);
  });

  it('requires employees to create tickets for themselves', () => {
    expect(() => assertEmployeeCreatesOwnTicket(employeeUser, employeeId)).not.toThrow();
    expect(() => assertEmployeeCreatesOwnTicket(employeeUser, otherUserId)).toThrow(
      ForbiddenException,
    );
  });

  it('scopes employee ticket lists to accessible tickets', () => {
    expect(getTicketListScope(employeeUser)).toEqual({ accessibleToUserId: employeeId });
    expect(getTicketListScope(adminUser)).toEqual({});
  });

  it('allows comment authors to edit their own comments', () => {
    const ownComment = { createdBy: new Types.ObjectId(employeeId) };

    expect(() => assertCanEditComment(employeeUser, ownComment)).not.toThrow();
    expect(() => assertCanEditComment(employeeUser, { createdBy: otherUserId })).toThrow(
      ForbiddenException,
    );
  });

  it('allows comment authors and admins to delete comments', () => {
    const ownComment = { createdBy: new Types.ObjectId(employeeId) };
    const foreignComment = { createdBy: new Types.ObjectId(otherUserId) };

    expect(() => assertCanDeleteComment(employeeUser, ownComment)).not.toThrow();
    expect(() => assertCanDeleteComment(employeeUser, foreignComment)).toThrow(ForbiddenException);
    expect(() => assertCanDeleteComment(adminUser, foreignComment)).not.toThrow();
  });
});
