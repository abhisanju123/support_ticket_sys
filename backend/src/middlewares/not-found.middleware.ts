import type { NextFunction, Request, Response } from 'express';

import { NotFoundException } from '../exceptions/index.js';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new NotFoundException(`Route ${req.method} ${req.originalUrl} not found`));
};
