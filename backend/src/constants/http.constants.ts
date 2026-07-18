export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_MESSAGES = {
  SUCCESS: 'Request completed successfully',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation failed',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  BAD_REQUEST: 'Bad request',
  CONFLICT: 'Resource conflict',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
} as const;
