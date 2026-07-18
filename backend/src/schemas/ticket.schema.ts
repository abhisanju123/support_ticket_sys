import { z } from 'zod';

import { DEFAULT_TICKET_STATUS } from '../constants/enum.constants.js';
import { TICKET_PRIORITIES, TicketPriority } from '../enums/ticket-priority.enum.js';
import { TICKET_STATUSES, TicketStatus } from '../enums/ticket-status.enum.js';

import { baseDocumentSchema, objectIdSchema } from './common.schema.js';

export const ticketDocumentSchema = baseDocumentSchema.extend({
  ticketNumber: z.number().int().positive(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  priority: z.enum(TICKET_PRIORITIES as [TicketPriority, ...TicketPriority[]]),
  status: z
    .enum(TICKET_STATUSES as [TicketStatus, ...TicketStatus[]])
    .default(DEFAULT_TICKET_STATUS),
  createdBy: objectIdSchema,
  assignedTo: objectIdSchema.optional(),
});

export type TicketDocumentInput = z.infer<typeof ticketDocumentSchema>;
