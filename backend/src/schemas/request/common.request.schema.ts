import { z } from 'zod';

import { objectIdSchema, ticketNumberSchema } from '../common.schema.js';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export const sortOrderSchema = z.enum(['asc', 'desc']);

export const paginationQueryFieldsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(MAX_LIMIT).optional(),
  sortOrder: sortOrderSchema.optional(),
});

export interface PaginationOptions {
  skip?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

export const buildPaginationOptions = (
  data: z.infer<typeof paginationQueryFieldsSchema> & { sortBy?: string },
  sortableFields: readonly string[],
): PaginationOptions => {
  const options: PaginationOptions = {};

  if (data.limit !== undefined) {
    const page = data.page ?? DEFAULT_PAGE;
    options.limit = data.limit;
    options.skip = (page - 1) * data.limit;
  } else if (data.page !== undefined) {
    options.limit = DEFAULT_LIMIT;
    options.skip = (data.page - 1) * DEFAULT_LIMIT;
  }

  if (data.sortBy && sortableFields.includes(data.sortBy)) {
    options.sort = {
      [data.sortBy]: data.sortOrder === 'asc' ? 1 : -1,
    };
  }

  return options;
};

export const ticketIdParamSchema = z.object({
  id: ticketNumberSchema,
});

export const ticketCommentParamSchema = z.object({
  ticketId: ticketNumberSchema,
});

export const ticketCommentIdParamSchema = z.object({
  ticketId: ticketNumberSchema,
  commentId: objectIdSchema,
});
