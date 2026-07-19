import { Router } from 'express';

import type { UserController } from '../controllers/user/user.controller.js';
import { Permission } from '../enums/permission.enum.js';
import { authorize } from '../middlewares/authorize.middleware.js';

export const createUserRouter = (userController: UserController): Router => {
  const router = Router();

  router.get('/', authorize(Permission.USER_LIST), userController.listUsers);

  return router;
};
