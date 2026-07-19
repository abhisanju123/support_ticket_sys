import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { hasPermission } from '../authorization/permission-check.js';
import type { Permission } from '../enums/permission.enum.js';
import { ForbiddenException, UnauthorizedException } from '../exceptions/index.js';

export const authorize = (...permissions: Permission[]): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedException('Authentication required'));
      return;
    }

    const isAllowed = permissions.some((permission) => hasPermission(req.user!.role, permission));

    if (!isAllowed) {
      next(new ForbiddenException('You do not have permission to perform this action'));
      return;
    }

    next();
  };
};
