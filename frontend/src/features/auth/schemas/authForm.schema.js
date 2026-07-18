import { z } from 'zod';

import {
  loginPasswordSchema,
  PASSWORD_POLICY_MESSAGE,
  strongPasswordSchema,
} from '../../../utils/validation/password.schema.js';

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Enter a valid email address');

export const loginFormSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters'),
    email: emailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export { PASSWORD_POLICY_MESSAGE };
