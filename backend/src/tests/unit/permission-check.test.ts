import { Permission } from '../../enums/permission.enum.js';
import { UserRole } from '../../enums/user-role.enum.js';
import { hasPermission } from '../../authorization/permission-check.js';

describe('hasPermission', () => {
  it('grants employees ticket view and create but not delete or status change', () => {
    expect(hasPermission(UserRole.EMPLOYEE, Permission.TICKET_VIEW)).toBe(true);
    expect(hasPermission(UserRole.EMPLOYEE, Permission.TICKET_CREATE)).toBe(true);
    expect(hasPermission(UserRole.EMPLOYEE, Permission.TICKET_DELETE)).toBe(false);
    expect(hasPermission(UserRole.EMPLOYEE, Permission.TICKET_CHANGE_STATUS)).toBe(false);
  });

  it('grants support agents status change but not delete', () => {
    expect(hasPermission(UserRole.SUPPORT_AGENT, Permission.TICKET_CHANGE_STATUS)).toBe(true);
    expect(hasPermission(UserRole.SUPPORT_AGENT, Permission.TICKET_DELETE)).toBe(false);
  });

  it('grants admins delete permission', () => {
    expect(hasPermission(UserRole.ADMIN, Permission.TICKET_DELETE)).toBe(true);
  });
});
