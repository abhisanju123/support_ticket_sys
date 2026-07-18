import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';
import { ZodError } from 'zod';

import { API_MESSAGES } from '../constants/index.js';
import { ValidationException } from '../exceptions/index.js';
import { formatZodValidationDetails } from '../utils/zod-error.util.js';

export interface RequestValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export const validate = (schemas: RequestValidationSchemas): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.params) {
        req.validatedParams = schemas.params.parse(req.params);
      }

      if (schemas.query) {
        req.validatedQuery = schemas.query.parse(req.query);
      }

      if (schemas.body) {
        req.validatedBody = schemas.body.parse(req.body);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationException(API_MESSAGES.VALIDATION_ERROR, formatZodValidationDetails(error)));
        return;
      }

      next(error);
    }
  };
};
