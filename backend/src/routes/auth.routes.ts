import { Router } from 'express';

import type { AuthController } from '../controllers/auth/auth.controller.js';
import { createAuthenticateMiddleware } from '../middlewares/authenticate.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginBodySchema, registerBodySchema } from '../schemas/request/auth.request.schema.js';
import type { AuthService } from '../services/auth/auth.service.js';

export const createAuthRouter = (
  authController: AuthController,
  authService: AuthService,
): Router => {
  const router = Router();
  const authenticate = createAuthenticateMiddleware(authService);

  router.post('/login', validate({ body: loginBodySchema }), authController.login);
  router.post('/register', validate({ body: registerBodySchema }), authController.register);
  router.get('/me', authenticate, authController.getCurrentUser);

  return router;
};
