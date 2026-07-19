import { resolveNotificationRecipients } from '../../authorization/notification-routing.js';
import { NotificationType } from '../../enums/notification-type.enum.js';
import type { TicketStatus } from '../../enums/ticket-status.enum.js';
import { UserRole } from '../../enums/user-role.enum.js';
import type { ITicketRecord } from '../../interfaces/ticket.interface.js';
import type { INotificationRepository } from '../../repositories/interfaces/notification.repository.interface.js';
import type { IUserRepository } from '../../repositories/interfaces/user.repository.interface.js';
import type { NotificationResponse } from '../../repositories/types/notification.repository.types.js';
import { NotFoundException } from '../../exceptions/index.js';
import type { AuthenticatedUser } from '../../types/auth.types.js';
import { BaseService } from '../base/base.service.js';
import type { UpdateTicketInput } from '../types/ticket.service.types.js';
import {
  buildCommentNotificationMessage,
  buildStatusChangeNotificationMessage,
  buildTicketUpdateNotificationMessage,
  describeTicketChanges,
} from './notification-messages.js';

export class NotificationService extends BaseService {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly userRepository: IUserRepository,
  ) {
    super();
  }

  async listForUser(user: AuthenticatedUser): Promise<NotificationResponse[]> {
    const notifications = await this.notificationRepository.findByRecipient(user.id, {
      unreadOnly: true,
    });
    return notifications.map((notification) => this.toResponse(notification));
  }

  async markAsRead(notificationId: string, user: AuthenticatedUser): Promise<void> {
    const updated = await this.notificationRepository.markAsRead(notificationId, user.id);

    if (!updated) {
      throw new NotFoundException('Notification not found');
    }
  }

  async markAllAsRead(user: AuthenticatedUser): Promise<void> {
    await this.notificationRepository.markAllAsRead(user.id);
  }

  async notifyCommentAdded(ticket: ITicketRecord, actor: AuthenticatedUser): Promise<void> {
    const actorName = await this.resolveActorName(actor);
    const creatorRole = await this.resolveCreatorRole(ticket);
    const recipients = resolveNotificationRecipients({
      actorId: actor.id,
      actorRole: actor.role,
      ticket,
      creatorRole,
    });

    await this.createNotifications({
      recipients,
      type: NotificationType.COMMENT_ADDED,
      message: buildCommentNotificationMessage(actorName),
      ticket,
      actor,
      actorName,
    });
  }

  async notifyTicketUpdated(
    existingTicket: ITicketRecord,
    input: UpdateTicketInput,
    actor: AuthenticatedUser,
  ): Promise<void> {
    const summary = describeTicketChanges(existingTicket, input);

    if (!summary) {
      return;
    }

    const updatedTicket = { ...existingTicket, ...this.previewTicketChanges(input) };
    const actorName = await this.resolveActorName(actor);
    const creatorRole = await this.resolveCreatorRole(existingTicket);
    const recipients = resolveNotificationRecipients({
      actorId: actor.id,
      actorRole: actor.role,
      ticket: updatedTicket,
      creatorRole,
    });

    await this.createNotifications({
      recipients,
      type: NotificationType.TICKET_UPDATED,
      message: buildTicketUpdateNotificationMessage(actorName, summary),
      ticket: updatedTicket,
      actor,
      actorName,
    });
  }

  async notifyStatusChanged(
    ticket: ITicketRecord,
    nextStatus: TicketStatus,
    actor: AuthenticatedUser,
  ): Promise<void> {
    const actorName = await this.resolveActorName(actor);
    const creatorRole = await this.resolveCreatorRole(ticket);
    const recipients = resolveNotificationRecipients({
      actorId: actor.id,
      actorRole: actor.role,
      ticket,
      creatorRole,
    });

    await this.createNotifications({
      recipients,
      type: NotificationType.STATUS_CHANGED,
      message: buildStatusChangeNotificationMessage(actorName, nextStatus),
      ticket,
      actor,
      actorName,
    });
  }

  private async createNotifications(params: {
    recipients: string[];
    type: NotificationType;
    message: string;
    ticket: ITicketRecord;
    actor: AuthenticatedUser;
    actorName: string;
  }): Promise<void> {
    const { recipients, type, message, ticket, actor, actorName } = params;

    if (recipients.length === 0) {
      return;
    }

    await this.notificationRepository.createMany(
      recipients.map((recipientId) => ({
        recipientId: this.toObjectId(recipientId),
        type,
        message,
        ticketNumber: ticket.ticketNumber,
        ticketTitle: ticket.title,
        actorId: this.toObjectId(actor.id),
        actorName,
        read: false,
      })),
    );
  }

  private async resolveActorName(actor: AuthenticatedUser): Promise<string> {
    const user = await this.userRepository.findById(actor.id);
    return user?.name ?? actor.email;
  }

  private async resolveCreatorRole(ticket: ITicketRecord) {
    const creator = await this.userRepository.findById(ticket.createdBy);
    return creator?.role ?? UserRole.EMPLOYEE;
  }

  private previewTicketChanges(input: UpdateTicketInput): Partial<ITicketRecord> {
    const preview: Partial<ITicketRecord> = {};

    if (input.title !== undefined) {
      preview.title = input.title.trim();
    }

    if (input.description !== undefined) {
      preview.description = input.description.trim();
    }

    if (input.priority !== undefined) {
      preview.priority = input.priority;
    }

    if (input.assignedTo !== undefined) {
      preview.assignedTo =
        input.assignedTo === null ? undefined : this.toObjectId(input.assignedTo);
    }

    return preview;
  }

  private toResponse(notification: {
    _id: { toString(): string };
    type: NotificationType;
    message: string;
    ticketNumber: number;
    ticketTitle: string;
    actorId: { toString(): string };
    actorName: string;
    read: boolean;
    createdAt: Date;
  }): NotificationResponse {
    return {
      _id: notification._id.toString(),
      type: notification.type,
      message: notification.message,
      ticketNumber: notification.ticketNumber,
      ticketTitle: notification.ticketTitle,
      actorId: notification.actorId.toString(),
      actorName: notification.actorName,
      read: notification.read,
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
