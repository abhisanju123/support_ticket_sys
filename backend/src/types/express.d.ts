declare global {
  namespace Express {
    interface Request {
      validatedQuery?: unknown;
      validatedBody?: unknown;
      validatedParams?: unknown;
      user?: import('./auth.types.js').AuthenticatedUser;
    }
  }
}

export {};
