import {
  assertCommentAuthorIsSelf,
  assertTicketVisible,
} from '../../authorization/ticket-access.js';
import type { ICommentRecord } from '../../interfaces/comment.interface.js';
import type { ICommentRepository } from '../../repositories/interfaces/comment.repository.interface.js';
import type { ITicketRepository } from '../../repositories/interfaces/ticket.repository.interface.js';
import type { IUserRepository } from '../../repositories/interfaces/user.repository.interface.js';
import type {
  CommentListOptions,
  ICommentPopulated,
} from '../../repositories/types/comment.repository.types.js';
import { NotFoundException, ValidationException } from '../../exceptions/index.js';
import type { AuthenticatedUser } from '../../types/auth.types.js';
import { BaseService } from '../base/base.service.js';
import type { NotificationService } from '../notification/notification.service.js';
import type { CreateCommentInput } from '../types/comment.service.types.js';

export class CommentService extends BaseService {
  constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly ticketRepository: ITicketRepository,
    private readonly userRepository: IUserRepository,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async createComment(input: CreateCommentInput, user: AuthenticatedUser): Promise<ICommentRecord> {
    const message = input.message?.trim();

    if (!message) {
      throw new ValidationException('Message is required');
    }

    if (!input.ticketNumber) {
      throw new ValidationException('Ticket is required');
    }

    if (!input.createdBy) {
      throw new ValidationException('Comment creator is required');
    }

    assertCommentAuthorIsSelf(user, String(input.createdBy));

    const ticket = await this.ticketRepository.findByTicketNumber(input.ticketNumber);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    assertTicketVisible(user, ticket);

    const creatorExists = await this.userRepository.existsById(input.createdBy);
    if (!creatorExists) {
      throw new NotFoundException('Comment creator not found');
    }

    const comment = await this.commentRepository.create({
      ticketId: ticket._id,
      message,
      createdBy: this.toObjectId(input.createdBy),
    });

    await this.notificationService.notifyCommentAdded(ticket, user);

    return comment;
  }

  async getCommentsByTicket(
    ticketNumber: number,
    user: AuthenticatedUser,
    options?: CommentListOptions,
  ): Promise<ICommentPopulated[]> {
    const ticket = await this.ticketRepository.findByTicketNumber(ticketNumber);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    assertTicketVisible(user, ticket);

    return this.commentRepository.findByTicketId(ticket._id, options);
  }
}
