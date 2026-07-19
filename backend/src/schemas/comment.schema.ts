import { z } from 'zod';

import { objectIdSchema } from './common.schema.js';

export const commentDocumentSchema = z.object({
  _id: objectIdSchema,
  ticketId: objectIdSchema,
  message: z.string().trim().min(1).max(5000),
  createdBy: objectIdSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CommentDocumentInput = z.infer<typeof commentDocumentSchema>;
