import type { TicketPriority } from '../../enums/ticket-priority.enum.js';
import type { ObjectId } from '../../types/domain.types.js';

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: TicketPriority;
  createdBy: string | ObjectId;
  assignedTo?: string | ObjectId;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  assignedTo?: string | ObjectId | null;
}

export interface TicketListQuery {
  skip?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}
