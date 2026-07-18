import { z } from 'zod';

import { TICKET_PRIORITIES, TicketPriority } from '../../enums/ticket-priority.enum.js';
import { TICKET_STATUSES, TicketStatus } from '../../enums/ticket-status.enum.js';
import { objectIdSchema } from '../common.schema.js';

import {
  buildPaginationOptions,
  paginationQueryFieldsSchema,
} from './common.request.schema.js';

const ticketPrioritySchema = z.enum(
  TICKET_PRIORITIES as [TicketPriority, ...TicketPriority[]],
);

const ticketStatusSchema = z.enum(TICKET_STATUSES as [TicketStatus, ...TicketStatus[]]);

const TICKET_SORT_FIELDS = ['ticketNumber', 'createdAt', 'updatedAt', 'title', 'priority', 'status'] as const;

export const createTicketBodySchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    description: z.string().trim().min(1, 'Description is required').max(5000),
    priority: ticketPrioritySchema,
    createdBy: objectIdSchema,
    assignedTo: objectIdSchema,
  })
  .strict();

export const updateTicketBodySchema = z
  .object({
    title: z.string().trim().min(1, 'Title cannot be empty').max(200).optional(),
    description: z.string().trim().min(1, 'Description cannot be empty').max(5000).optional(),
    priority: ticketPrioritySchema.optional(),
    assignedTo: objectIdSchema.nullable().optional(),
  })
  .strict();

export const changeTicketStatusBodySchema = z
  .object({
    status: ticketStatusSchema,
  })
  .strict();

export const ticketListQuerySchema = paginationQueryFieldsSchema
  .extend({
    keyword: z.string().trim().min(1, 'Search keyword cannot be empty').optional(),
    status: ticketStatusSchema.optional(),
    sortBy: z.enum(TICKET_SORT_FIELDS).optional(),
  })
  .transform((data) => ({
    ...buildPaginationOptions(data, TICKET_SORT_FIELDS),
    keyword: data.keyword,
    status: data.status,
  }));

export type CreateTicketBody = z.infer<typeof createTicketBodySchema>;
export type UpdateTicketBody = z.infer<typeof updateTicketBodySchema>;
export type ChangeTicketStatusBody = z.infer<typeof changeTicketStatusBodySchema>;
export type TicketListQueryInput = z.infer<typeof ticketListQuerySchema>;
