import { z } from 'zod';

import { commentMessageSchema, requiredUserFromListSchema } from './common.schema.js';

/**
 * @param {string[]} [validUserIds]
 */
export const createCommentFormSchema = (validUserIds = []) =>
  z.object({
    message: commentMessageSchema,
    createdBy: requiredUserFromListSchema(validUserIds, 'Please select comment author'),
  });

/** @deprecated Use createCommentFormSchema */
export const addCommentFormSchema = createCommentFormSchema();
