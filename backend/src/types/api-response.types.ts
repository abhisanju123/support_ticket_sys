export interface ApiErrorBody {
  code: string;
  details?: unknown;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: ApiErrorBody;
}

export type ApiResponseBody<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
