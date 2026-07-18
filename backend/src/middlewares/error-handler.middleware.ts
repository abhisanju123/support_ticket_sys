import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.js';
import { API_MESSAGES, ERROR_CODES, HTTP_STATUS } from '../constants/index.js';
import { AppException } from '../exceptions/index.js';
import { sendError } from '../helpers/api-response.helper.js';
import { logger } from '../utils/logger.util.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof AppException) {
    if (!err.isOperational) {
      logger.error('Non-operational error', {
        message: err.message,
        code: err.code,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
      });
    } else {
      logger.warn('Operational error', {
        message: err.message,
        code: err.code,
        path: req.originalUrl,
        method: req.method,
      });
    }

    sendError(res, err.message, err.statusCode, err.code, err.details);
    return;
  }

  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  const details =
    env.NODE_ENV === 'development'
      ? {
          stack: err.stack,
        }
      : undefined;

  sendError(
    res,
    API_MESSAGES.INTERNAL_ERROR,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ERROR_CODES.INTERNAL_SERVER_ERROR,
    details,
  );
};
