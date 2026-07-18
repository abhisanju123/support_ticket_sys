import { z } from 'zod';

const PASSWORD_MIN_LENGTH = 8;
const HAS_UPPERCASE = /[A-Z]/;
const HAS_LOWERCASE = /[a-z]/;
const HAS_DIGIT = /[1-9]/;
const HAS_SPECIAL = /[@$!]/;

export const PASSWORD_POLICY_MESSAGE =
  'Password must be at least 8 characters and include an uppercase letter, lowercase letter, a number (1-9), and a special character (@, $, or !).';

const meetsPasswordPolicy = (value: string): boolean =>
  value.length >= PASSWORD_MIN_LENGTH &&
  HAS_UPPERCASE.test(value) &&
  HAS_LOWERCASE.test(value) &&
  HAS_DIGIT.test(value) &&
  HAS_SPECIAL.test(value);

export const strongPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .max(128, 'Password cannot exceed 128 characters')
  .refine(meetsPasswordPolicy, PASSWORD_POLICY_MESSAGE);

export const loginPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .max(128, 'Password cannot exceed 128 characters');
