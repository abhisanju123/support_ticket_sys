import { TICKET_STATUSES, TicketStatus } from '../../enums/ticket-status.enum.js';
import type { ITicketRecord } from '../../interfaces/ticket.interface.js';
import type { ITicketRepository } from '../../repositories/interfaces/ticket.repository.interface.js';
import { BadRequestException, NotFoundException, ValidationException } from '../../exceptions/index.js';
import type { AuthenticatedUser } from '../../types/auth.types.js';
import { BaseService } from '../base/base.service.js';
import type { NotificationService } from '../notification/notification.service.js';
import { isAllowedTicketStatusTransition } from './ticket-status-transitions.js';

export class TicketStatusService extends BaseService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async transitionStatus(
    ticketNumber: number,
    nextStatus: TicketStatus,
    actor: AuthenticatedUser,
  ): Promise<ITicketRecord> {
    if (!TICKET_STATUSES.includes(nextStatus)) {
      throw new ValidationException('Invalid ticket status');
    }

    const ticket = await this.ticketRepository.findByTicketNumber(ticketNumber);

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (!isAllowedTicketStatusTransition(ticket.status, nextStatus)) {
      throw new BadRequestException(
        `Invalid status transition from '${ticket.status}' to '${nextStatus}'`,
      );
    }

    const updatedTicket = await this.ticketRepository.updateById(ticket._id, {
      status: nextStatus,
    });

    if (!updatedTicket) {
      throw new NotFoundException('Ticket not found');
    }

    await this.notificationService.notifyStatusChanged(updatedTicket, nextStatus, actor);

    return updatedTicket;
  }
}
