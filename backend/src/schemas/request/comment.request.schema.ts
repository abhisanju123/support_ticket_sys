import { z } from 'zod';

import { objectIdSchema } from '../common.schema.js';

import { buildPaginationOptions, paginationQueryFieldsSchema } from './common.request.schema.js';

const COMMENT_SORT_FIELDS = ['createdAt'] as const;

export const createCommentBodySchema = z
  .object({
    message: z.string().trim().min(1, 'Message is required').max(5000),
    createdBy: objectIdSchema,
  })
  .strict();

export const updateCommentBodySchema = z
  .object({
    message: z.string().trim().min(1, 'Message is required').max(5000),
  })
  .strict();

export const commentListQuerySchema = paginationQueryFieldsSchema
  .extend({
    sortBy: z.enum(COMMENT_SORT_FIELDS).optional(),
  })
  .transform((data) => buildPaginationOptions(data, COMMENT_SORT_FIELDS));

export type CreateCommentBody = z.infer<typeof createCommentBodySchema>;
export type UpdateCommentBody = z.infer<typeof updateCommentBodySchema>;
export type CommentListQueryInput = z.infer<typeof commentListQuerySchema>;
