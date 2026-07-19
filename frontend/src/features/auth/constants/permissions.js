export const Permission = {
  DASHBOARD_VIEW: 'dashboard:view',
  TICKET_VIEW: 'ticket:view',
  TICKET_CREATE: 'ticket:create',
  TICKET_EDIT: 'ticket:edit',
  TICKET_DELETE: 'ticket:delete',
  TICKET_CHANGE_STATUS: 'ticket:change_status',
  COMMENT_CREATE: 'comment:create',
  COMMENT_VIEW: 'comment:view',
  USER_LIST: 'user:list',
};

export const UserRole = {
  EMPLOYEE: 'employee',
  SUPPORT_AGENT: 'support_agent',
  ADMIN: 'admin',
};

export const ROLE_PERMISSIONS = {
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

export const ROLE_LABELS = {
  [UserRole.EMPLOYEE]: 'Employee',
  [UserRole.SUPPORT_AGENT]: 'Support Agent',
  [UserRole.ADMIN]: 'Admin',
};

export function hasPermission(role, permission) {
  if (!role) {
    return false;
  }

  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
