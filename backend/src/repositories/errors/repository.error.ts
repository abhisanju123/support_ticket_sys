export class RepositoryError extends Error {
  public readonly code: string;

  public readonly cause?: unknown;

  constructor(message: string, code: string, cause?: unknown) {
    super(message);
    this.name = 'RepositoryError';
    this.code = code;
    this.cause = cause;
  }
}
