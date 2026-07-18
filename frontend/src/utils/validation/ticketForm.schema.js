import { z } from 'zod';

import {
  optionalUserFromListSchema,
  requiredTicketPrioritySchema,
  requiredUserFromListSchema,
  ticketDescriptionSchema,
  ticketPrioritySchema,
  ticketTitleSchema,
} from './common.schema.js';

/**
 * @param {string[]} [validUserIds]
 */
export const createCreateTicketFormSchema = (validUserIds = []) =>
  z.object({
    title: ticketTitleSchema,
    description: ticketDescriptionSchema,
    priority: requiredTicketPrioritySchema,
    createdBy: requiredUserFromListSchema(validUserIds, 'Created By is required'),
    assignedTo: requiredUserFromListSchema(validUserIds, 'Assigned User is required'),
  });

/** @deprecated Use createCreateTicketFormSchema */
export const createTicketFormSchema = createCreateTicketFormSchema();

/**
 * @param {string[]} [validUserIds]
 */
export const createEditTicketFormSchema = (validUserIds = []) =>
  z.object({
    title: ticketTitleSchema,
    description: ticketDescriptionSchema,
    priority: ticketPrioritySchema,
    assignedTo: optionalUserFromListSchema(validUserIds),
  });

/** @deprecated Use createEditTicketFormSchema */
export const editTicketFormSchema = createEditTicketFormSchema();
