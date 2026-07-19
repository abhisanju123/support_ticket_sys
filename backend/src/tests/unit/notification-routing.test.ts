import { resolveNotificationRecipients } from '../../authorization/notification-routing.js';
import { UserRole } from '../../enums/user-role.enum.js';

const ticket = {
  createdBy: 'creator-1',
  assignedTo: 'assignee-1',
};

describe('resolveNotificationRecipients', () => {
  it('notifies assignee when an employee comments', () => {
    expect(
      resolveNotificationRecipients({
        actorId: 'creator-1',
        actorRole: UserRole.EMPLOYEE,
        ticket,
        creatorRole: UserRole.EMPLOYEE,
      }),
    ).toEqual(['assignee-1']);
  });

  it('does not notify the commenting employee', () => {
    expect(
      resolveNotificationRecipients({
        actorId: 'creator-1',
        actorRole: UserRole.EMPLOYEE,
        ticket: { createdBy: 'creator-1', assignedTo: 'creator-1' },
        creatorRole: UserRole.EMPLOYEE,
      }),
    ).toEqual([]);
  });

  it('notifies ticket creator when staff comments on an employee ticket', () => {
    expect(
      resolveNotificationRecipients({
        actorId: 'agent-1',
        actorRole: UserRole.SUPPORT_AGENT,
        ticket,
        creatorRole: UserRole.EMPLOYEE,
      }),
    ).toEqual(['creator-1']);
  });

  it('does not notify anyone when staff comments on their own employee ticket record', () => {
    expect(
      resolveNotificationRecipients({
        actorId: 'creator-1',
        actorRole: UserRole.ADMIN,
        ticket: { createdBy: 'creator-1', assignedTo: 'assignee-1' },
        creatorRole: UserRole.EMPLOYEE,
      }),
    ).toEqual([]);
  });

  it('does not notify when employee comments on an unassigned ticket', () => {
    expect(
      resolveNotificationRecipients({
        actorId: 'creator-1',
        actorRole: UserRole.EMPLOYEE,
        ticket: { createdBy: 'creator-1', assignedTo: undefined },
        creatorRole: UserRole.EMPLOYEE,
      }),
    ).toEqual([]);
  });
});
