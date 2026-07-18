import type { ZodError } from 'zod';

export interface ZodValidationIssue {
  path: string;
  message: string;
  code: string;
}

export interface ZodValidationDetails {
  fields: Record<string, string[] | undefined>;
  issues: ZodValidationIssue[];
}

export const formatZodValidationDetails = (error: ZodError): ZodValidationDetails => ({
  fields: error.flatten().fieldErrors,
  issues: error.issues.map((issue) => ({
    path: issue.path.length > 0 ? issue.path.join('.') : 'root',
    message: issue.message,
    code: issue.code,
  })),
});
