import { z } from 'zod';

import { loginPasswordSchema, strongPasswordSchema } from '../password.schema.js';

export const loginBodySchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  password: loginPasswordSchema,
});

export const registerBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  password: strongPasswordSchema,
});
export type LoginBody = z.infer<typeof loginBodySchema>;
export type RegisterBody = z.infer<typeof registerBodySchema>;
