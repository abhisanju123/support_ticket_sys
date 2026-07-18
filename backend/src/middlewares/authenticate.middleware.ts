import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { UnauthorizedException } from '../exceptions/index.js';
import type { AuthService } from '../services/auth/auth.service.js';
import type { AuthenticatedUser } from '../types/auth.types.js';

export const createAuthenticateMiddleware = (authService: AuthService): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      next(new UnauthorizedException());
      return;
    }

    const token = authorization.slice('Bearer '.length).trim();

    if (!token) {
      next(new UnauthorizedException());
      return;
    }

    try {
      const payload = authService.verifyAccessToken(token);

      const user: AuthenticatedUser = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};
