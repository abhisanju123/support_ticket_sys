import { z } from 'zod';

import { OBJECT_ID_REGEX, TICKET_PRIORITIES } from '../../features/tickets/constants/ticket.constants.js';

export const TITLE_MAX_LENGTH = 200;
export const DESCRIPTION_MAX_LENGTH = 5000;
export const COMMENT_MAX_LENGTH = 5000;

export const ticketTitleSchema = z
  .string()
  .trim()
  .min(1, 'Title is required')
  .max(TITLE_MAX_LENGTH, `Title must be at most ${TITLE_MAX_LENGTH} characters`);

export const ticketDescriptionSchema = z
  .string()
  .trim()
  .min(1, 'Description is required')
  .max(DESCRIPTION_MAX_LENGTH, `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`);

export const ticketPrioritySchema = z.enum(TICKET_PRIORITIES, {
  message: 'Select a valid priority',
});

export const requiredTicketPrioritySchema = z
  .string()
  .min(1, 'Priority is required')
  .pipe(
    z.enum(TICKET_PRIORITIES, {
      message: 'Select a valid priority',
    }),
  );

export const commentMessageSchema = z
  .string()
  .trim()
  .min(1, 'Comment is required')
  .max(COMMENT_MAX_LENGTH, `Comment must be at most ${COMMENT_MAX_LENGTH} characters`);

const objectIdFormatSchema = z
  .string()
  .trim()
  .regex(OBJECT_ID_REGEX, 'Enter a valid 24-character user ID');

/**
 * @param {string} [message]
 */
export const requiredUserIdSchema = (message = 'Please select a user') =>
  z.string().trim().min(1, message).pipe(objectIdFormatSchema);

/**
 * @param {string[]} validUserIds
 * @param {string} [emptyMessage]
 */
export const requiredUserFromListSchema = (
  validUserIds = [],
  emptyMessage = 'Please select a user',
) => {
  const base = requiredUserIdSchema(emptyMessage);

  if (validUserIds.length === 0) {
    return base;
  }

  return base.refine((value) => validUserIds.includes(value), {
    message: 'Select a user from the system',
  });
};

/**
 * @param {string[]} validUserIds
 */
export const optionalUserFromListSchema = (validUserIds = []) => {
  const base = z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || OBJECT_ID_REGEX.test(value), {
      message: 'Enter a valid 24-character user ID',
    });

  if (validUserIds.length === 0) {
    return base;
  }

  return base.refine((value) => !value || validUserIds.includes(value), {
    message: 'Select a user from the system',
  });
};
