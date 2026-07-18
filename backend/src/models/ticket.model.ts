import mongoose, { Schema, model, type HydratedDocument, type Model } from 'mongoose';

import { DEFAULT_TICKET_STATUS } from '../constants/enum.constants.js';
import { COLLECTIONS } from '../constants/collection.constants.js';
import { applySchemaIndexes } from '../database/apply-indexes.js';
import { TICKET_PRIORITIES } from '../enums/ticket-priority.enum.js';
import { TICKET_STATUSES } from '../enums/ticket-status.enum.js';
import type { ITicketRecord } from '../interfaces/ticket.interface.js';

export type TicketDocument = HydratedDocument<ITicketRecord>;

const ticketSchema = new Schema(
  {
    ticketNumber: {
      type: Number,
      required: [true, 'Ticket number is required'],
      unique: true,
      min: [1, 'Ticket number must be at least 1'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: TICKET_PRIORITIES,
        message: 'Invalid ticket priority',
      },
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: TICKET_STATUSES,
        message: 'Invalid ticket status',
      },
      default: DEFAULT_TICKET_STATUS,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: COLLECTIONS.USERS,
      required: [true, 'createdBy is required'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: COLLECTIONS.USERS,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTIONS.TICKETS,
  },
);

applySchemaIndexes(ticketSchema, COLLECTIONS.TICKETS);

export const Ticket = (
  (mongoose.models[COLLECTIONS.TICKETS] as Model<TicketDocument> | undefined) ??
  model(COLLECTIONS.TICKETS, ticketSchema)
) as Model<TicketDocument>;
