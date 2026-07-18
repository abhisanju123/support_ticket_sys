import { z } from 'zod';

import { USER_ROLES, UserRole } from '../enums/user-role.enum.js';

import { baseDocumentSchema } from './common.schema.js';

export const userDocumentSchema = baseDocumentSchema.extend({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(255),
  role: z.enum(USER_ROLES as [UserRole, ...UserRole[]]),
});

export type UserDocumentInput = z.infer<typeof userDocumentSchema>;
