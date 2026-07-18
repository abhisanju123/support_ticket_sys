import type { Request, Response } from 'express';

import { ApiResponse } from '../../helpers/api-response.helper.js';
import { asyncHandler } from '../../middlewares/index.js';
import type { LoginBody, RegisterBody } from '../../schemas/request/auth.request.schema.js';
import type { AuthService } from '../../services/auth/auth.service.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.validatedBody as LoginBody;
    const result = await this.authService.login(email, password);

    ApiResponse.success(res, result, 'Signed in successfully');
  });

  register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.validatedBody as RegisterBody;
    const result = await this.authService.register(name, email, password);

    ApiResponse.created(res, result, 'Account created successfully');
  });

  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.authService.getUserProfile(req.user!.id);

    ApiResponse.success(res, user, 'Current user retrieved successfully');
  });
}
