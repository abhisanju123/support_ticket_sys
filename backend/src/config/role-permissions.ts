import { Permission } from '../enums/permission.enum.js';
import { UserRole } from '../enums/user-role.enum.js';

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  [UserRole.EMPLOYEE]: [
    Permission.DASHBOARD_VIEW,
    Permission.TICKET_VIEW,
    Permission.TICKET_CREATE,
    Permission.TICKET_EDIT,
    Permission.COMMENT_CREATE,
    Permission.COMMENT_VIEW,
    Permission.USER_LIST,
  ],
  [UserRole.SUPPORT_AGENT]: [
    Permission.DASHBOARD_VIEW,
    Permission.TICKET_VIEW,
    Permission.TICKET_CREATE,
    Permission.TICKET_EDIT,
    Permission.TICKET_CHANGE_STATUS,
    Permission.COMMENT_CREATE,
    Permission.COMMENT_VIEW,
    Permission.USER_LIST,
  ],
  [UserRole.ADMIN]: [
    Permission.DASHBOARD_VIEW,
    Permission.TICKET_VIEW,
    Permission.TICKET_CREATE,
    Permission.TICKET_EDIT,
    Permission.TICKET_DELETE,
    Permission.TICKET_CHANGE_STATUS,
    Permission.COMMENT_CREATE,
    Permission.COMMENT_VIEW,
    Permission.USER_LIST,
  ],
};
