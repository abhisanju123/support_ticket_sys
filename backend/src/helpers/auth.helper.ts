import type { Request } from 'express';

import { UnauthorizedException } from '../exceptions/index.js';
import type { AuthenticatedUser } from '../types/auth.types.js';

export function getAuthenticatedUser(req: Request): AuthenticatedUser {
  if (!req.user) {
    throw new UnauthorizedException('Authentication required');
  }

  return req.user;
}
