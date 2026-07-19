export enum Permission {
  DASHBOARD_VIEW = 'dashboard:view',
  TICKET_VIEW = 'ticket:view',
  TICKET_CREATE = 'ticket:create',
  TICKET_EDIT = 'ticket:edit',
  TICKET_DELETE = 'ticket:delete',
  TICKET_CHANGE_STATUS = 'ticket:change_status',
  COMMENT_CREATE = 'comment:create',
  COMMENT_VIEW = 'comment:view',
  USER_LIST = 'user:list',
}

export const PERMISSIONS = Object.values(Permission);
