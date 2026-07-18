import { Router } from 'express';

import type { UserController } from '../controllers/user/user.controller.js';

export const createUserRouter = (userController: UserController): Router => {
  const router = Router();

  router.get('/', userController.listUsers);

  return router;
};
