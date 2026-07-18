import type { ITicketRepository } from '../../repositories/interfaces/ticket.repository.interface.js';
import type { ICommentRepository } from '../../repositories/interfaces/comment.repository.interface.js';
import { NotFoundException } from '../../exceptions/index.js';
import { BaseService } from '../base/base.service.js';

export class TicketDeletionService extends BaseService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly commentRepository: ICommentRepository,
  ) {
    super();
  }

  async deleteTicket(ticketNumber: number): Promise<void> {
    const existingTicket = await this.ticketRepository.findByTicketNumber(ticketNumber);

    if (!existingTicket) {
      throw new NotFoundException('Ticket not found');
    }

    await this.commentRepository.deleteByTicketId(existingTicket._id);

    const deleted = await this.ticketRepository.deleteById(existingTicket._id);

    if (!deleted) {
      throw new NotFoundException('Ticket not found');
    }
  }
}
