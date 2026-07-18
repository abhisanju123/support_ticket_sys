import type { Request, Response } from 'express';

import { ApiResponse } from '../../helpers/api-response.helper.js';
import { asyncHandler } from '../../middlewares/index.js';
import type { IUserRepository } from '../../repositories/interfaces/user.repository.interface.js';

export class UserController {
  constructor(private readonly userRepository: IUserRepository) {}

  listUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await this.userRepository.findAll({ sort: { name: 1 } });

    ApiResponse.success(
      res,
      users.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      })),
      'Users retrieved successfully',
    );
  });
}
