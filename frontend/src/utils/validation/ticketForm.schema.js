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
 * @param {string[]} [validReporterIds]
 * @param {string[]} [validAssigneeIds]
 */
export const createCreateTicketFormSchema = (validReporterIds = [], validAssigneeIds = validReporterIds) =>
  z.object({
    title: ticketTitleSchema,
    description: ticketDescriptionSchema,
    priority: requiredTicketPrioritySchema,
    createdBy: requiredUserFromListSchema(validReporterIds, 'Created By is required'),
    assignedTo: requiredUserFromListSchema(validAssigneeIds, 'Assigned User is required'),
  });

/** @deprecated Use createCreateTicketFormSchema */
export const createTicketFormSchema = createCreateTicketFormSchema();

/**
 * @param {string[]} [validAssigneeIds]
 */
export const createEditTicketFormSchema = (validAssigneeIds = []) =>
  z.object({
    title: ticketTitleSchema,
    description: ticketDescriptionSchema,
    priority: ticketPrioritySchema,
    assignedTo: optionalUserFromListSchema(validAssigneeIds),
  });

/** @deprecated Use createEditTicketFormSchema */
export const editTicketFormSchema = createEditTicketFormSchema();
