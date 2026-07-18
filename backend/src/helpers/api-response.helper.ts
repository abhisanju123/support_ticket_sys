import type { Response } from 'express';

import { API_MESSAGES, HTTP_STATUS } from '../constants/index.js';
import type { ApiErrorResponse, ApiSuccessResponse } from '../types/api-response.types.js';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = API_MESSAGES.SUCCESS,
  statusCode: number = HTTP_STATUS.OK,
): Response<ApiSuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = API_MESSAGES.SUCCESS,
): Response<ApiSuccessResponse<T>> => {
  return sendSuccess(res, data, message, HTTP_STATUS.CREATED);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number,
  code: string,
  details?: unknown,
): Response<ApiErrorResponse> => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      ...(details !== undefined && { details }),
    },
  });
};

export const ApiResponse = {
  success: sendSuccess,
  created: sendCreated,
  error: sendError,
};
