import { assertEmployeeCreatesOwnTicket, assertValidAssignee } from '../../authorization/ticket-access.js';
import { DEFAULT_TICKET_STATUS } from '../../constants/enum.constants.js';
import { TICKET_PRIORITIES } from '../../enums/ticket-priority.enum.js';
import { UserRole } from '../../enums/user-role.enum.js';
import type { AuthenticatedUser } from '../../types/auth.types.js';
import type { ITicketRecord } from '../../interfaces/ticket.interface.js';
import type { ITicketRepository } from '../../repositories/interfaces/ticket.repository.interface.js';
import type { IUserRepository } from '../../repositories/interfaces/user.repository.interface.js';
import { NotFoundException, ValidationException } from '../../exceptions/index.js';
import { BaseService } from '../base/base.service.js';
import type { CreateTicketInput } from '../types/ticket.service.types.js';

export class TicketCreationService extends BaseService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly userRepository: IUserRepository,
  ) {
    super();
  }

  async createTicket(input: CreateTicketInput, user: AuthenticatedUser): Promise<ITicketRecord> {
    const title = input.title?.trim();
    const description = input.description?.trim();

    if (!title) {
      throw new ValidationException('Title is required');
    }

    if (!description) {
      throw new ValidationException('Description is required');
    }

    if (!input.createdBy) {
      throw new ValidationException('Created by is required');
    }

    const createdBy =
      user.role === UserRole.EMPLOYEE ? user.id : String(input.createdBy);

    assertEmployeeCreatesOwnTicket(user, createdBy);

    if (!TICKET_PRIORITIES.includes(input.priority)) {
      throw new ValidationException('Invalid ticket priority');
    }

    const creatorExists = await this.userRepository.existsById(createdBy);
    if (!creatorExists) {
      throw new NotFoundException('Creator not found');
    }

    if (input.assignedTo) {
      await assertValidAssignee(this.userRepository, String(input.assignedTo));
    }

    return this.ticketRepository.create({
      title,
      description,
      priority: input.priority,
      status: DEFAULT_TICKET_STATUS,
      createdBy: this.toObjectId(createdBy),
      ...(input.assignedTo !== undefined && {
        assignedTo: this.toObjectId(input.assignedTo),
      }),
    });
  }
}
