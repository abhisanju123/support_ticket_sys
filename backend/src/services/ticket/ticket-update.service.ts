import { assertCanEditTicket, assertValidAssignee } from '../../authorization/ticket-access.js';
import { TICKET_PRIORITIES } from '../../enums/ticket-priority.enum.js';
import type { ITicketRecord } from '../../interfaces/ticket.interface.js';
import type { ITicketRepository } from '../../repositories/interfaces/ticket.repository.interface.js';
import type { IUserRepository } from '../../repositories/interfaces/user.repository.interface.js';
import type { RepositoryUpdateInput } from '../../repositories/types/repository.types.js';
import { NotFoundException, ValidationException } from '../../exceptions/index.js';
import type { AuthenticatedUser } from '../../types/auth.types.js';
import { BaseService } from '../base/base.service.js';
import type { NotificationService } from '../notification/notification.service.js';
import type { UpdateTicketInput } from '../types/ticket.service.types.js';

export class TicketUpdateService extends BaseService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly userRepository: IUserRepository,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async updateTicket(
    ticketNumber: number,
    input: UpdateTicketInput,
    user: AuthenticatedUser,
  ): Promise<ITicketRecord> {
    const existingTicket = await this.ticketRepository.findByTicketNumber(ticketNumber);

    if (!existingTicket) {
      throw new NotFoundException('Ticket not found');
    }

    assertCanEditTicket(user, existingTicket);

    const updateData: RepositoryUpdateInput<ITicketRecord> = {};

    if (input.title !== undefined) {
      const title = input.title.trim();
      if (!title) {
        throw new ValidationException('Title cannot be empty');
      }
      updateData.title = title;
    }

    if (input.description !== undefined) {
      const description = input.description.trim();
      if (!description) {
        throw new ValidationException('Description cannot be empty');
      }
      updateData.description = description;
    }

    if (input.priority !== undefined) {
      if (!TICKET_PRIORITIES.includes(input.priority)) {
        throw new ValidationException('Invalid ticket priority');
      }
      updateData.priority = input.priority;
    }

    if (input.assignedTo !== undefined) {
      if (input.assignedTo === null) {
        updateData.assignedTo = undefined;
      } else {
        await assertValidAssignee(this.userRepository, String(input.assignedTo));
        updateData.assignedTo = this.toObjectId(input.assignedTo);
      }
    }

    if (Object.keys(updateData).length === 0) {
      return existingTicket;
    }

    const updatedTicket = await this.ticketRepository.updateById(existingTicket._id, updateData);

    if (!updatedTicket) {
      throw new NotFoundException('Ticket not found');
    }

    await this.notificationService.notifyTicketUpdated(existingTicket, input, user);

    return updatedTicket;
  }
}
