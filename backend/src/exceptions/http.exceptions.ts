import { API_MESSAGES, ERROR_CODES, HTTP_STATUS } from '../constants/index.js';

import { AppException } from './app.exception.js';

export class BadRequestException extends AppException {
  constructor(message: string = API_MESSAGES.BAD_REQUEST, details?: unknown) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST, details);
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string = API_MESSAGES.UNAUTHORIZED, details?: unknown) {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, details);
  }
}

export class ForbiddenException extends AppException {
  constructor(message: string = API_MESSAGES.FORBIDDEN, details?: unknown) {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN, details);
  }
}

export class NotFoundException extends AppException {
  constructor(message: string = API_MESSAGES.NOT_FOUND, details?: unknown) {
    super(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, details);
  }
}

export class ConflictException extends AppException {
  constructor(message: string = API_MESSAGES.CONFLICT, details?: unknown) {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT, details);
  }
}

export class ValidationException extends AppException {
  constructor(message: string = API_MESSAGES.VALIDATION_ERROR, details?: unknown) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR, details);
  }
}

export class InternalServerException extends AppException {
  constructor(message: string = API_MESSAGES.INTERNAL_ERROR, details?: unknown) {
    super(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      details,
      false,
    );
  }
}
