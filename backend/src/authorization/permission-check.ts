import { ROLE_PERMISSIONS } from '../config/role-permissions.js';
import { Permission } from '../enums/permission.enum.js';
import type { UserRole } from '../enums/user-role.enum.js';
import { ForbiddenException } from '../exceptions/index.js';

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function assertHasPermission(role: UserRole, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new ForbiddenException('You do not have permission to perform this action');
  }
}
