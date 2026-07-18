import type { TicketPriority } from '../enums/ticket-priority.enum.js';
import type { TicketStatus } from '../enums/ticket-status.enum.js';
import type { ObjectId } from '../types/domain.types.js';

/** Core ticket fields stored in MongoDB. */
export interface ITicket {
  ticketNumber: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: ObjectId;
  assignedTo?: ObjectId;
}

/** Full persisted ticket document including id and timestamps. */
export interface ITicketRecord extends ITicket {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
