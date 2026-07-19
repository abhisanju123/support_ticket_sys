import { assertTicketVisible, getTicketListScope } from '../../authorization/ticket-access.js';
import type { ITicketPopulated } from '../../repositories/types/ticket.repository.types.js';
import type { ITicketRepository } from '../../repositories/interfaces/ticket.repository.interface.js';
import { NotFoundException } from '../../exceptions/index.js';
import type { AuthenticatedUser } from '../../types/auth.types.js';
import { BaseService } from '../base/base.service.js';
import type { TicketListQuery } from '../types/ticket.service.types.js';

const DEFAULT_LIST_SORT = { ticketNumber: 1 } as const;

export class TicketRetrievalService extends BaseService {
  constructor(private readonly ticketRepository: ITicketRepository) {
    super();
  }

  async getTicketById(ticketNumber: number, user: AuthenticatedUser): Promise<ITicketPopulated> {
    const ticket = await this.ticketRepository.findByTicketNumberWithUsers(ticketNumber);

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    assertTicketVisible(user, ticket);

    return ticket;
  }

  async getAllTickets(
    query: TicketListQuery,
    user: AuthenticatedUser,
  ): Promise<ITicketPopulated[]> {
    const { skip, limit, sort = DEFAULT_LIST_SORT } = query;

    return this.ticketRepository.listWithUsers({
      skip,
      limit,
      sort,
      ...getTicketListScope(user),
    });
  }
}
