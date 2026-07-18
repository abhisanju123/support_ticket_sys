import type { Request } from 'express';

export const getRouteParam = (req: Request, name: string): string => {
  const params = (req.validatedParams ?? req.params) as Record<string, string | string[] | undefined>;
  const value = params[name];

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0];
  }

  return '';
};

export const getTicketNumberParam = (req: Request, name = 'id'): number => {
  const params = (req.validatedParams ?? req.params) as Record<string, unknown>;
  const value = params[name];

  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === 'string' && /^[1-9]\d*$/.test(value)) {
    return Number(value);
  }

  return Number.NaN;
};

export const getValidatedQuery = <T>(req: Request): T => (req.validatedQuery ?? req.query) as T;

export const getValidatedBody = <T>(req: Request): T => (req.validatedBody ?? req.body) as T;
