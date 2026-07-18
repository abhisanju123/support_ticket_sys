import { z } from 'zod';

export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId format');

export const ticketNumberSchema = z.coerce
  .number()
  .int('Ticket number must be an integer')
  .positive('Ticket number must be greater than 0');

export const baseDocumentSchema = z.object({
  _id: objectIdSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
