import type { TicketPriority } from '../../enums/ticket-priority.enum.js';
import type { TicketStatus } from '../../enums/ticket-status.enum.js';
import type { ITicketRecord } from '../../interfaces/ticket.interface.js';
import type { IUserRecord } from '../../interfaces/user.interface.js';
import type { ObjectId } from '../../types/domain.types.js';
import type { FindAllOptions } from './repository.types.js';

export type PopulatedUserSummary = Pick<IUserRecord, '_id' | 'name' | 'email' | 'role'>;

export interface ITicketPopulated extends Omit<ITicketRecord, 'createdBy' | 'assignedTo'> {
  createdBy: PopulatedUserSummary;
  assignedTo?: PopulatedUserSummary | null;
}

export interface TicketListOptions extends FindAllOptions {
  status?: TicketStatus;
  priority?: TicketPriority;
  createdBy?: string | ObjectId;
  assignedTo?: string | ObjectId;
  keyword?: string;
}

export type TicketQueryOptions = Pick<
  TicketListOptions,
  'filter' | 'status' | 'priority' | 'createdBy' | 'assignedTo' | 'keyword'
>;
