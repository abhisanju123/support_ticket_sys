import { TICKET_PRIORITY_LABELS, TICKET_STATUS_LABELS } from '../../constants/enum.constants.js';
import type { TicketPriority } from '../../enums/ticket-priority.enum.js';
import type { TicketStatus } from '../../enums/ticket-status.enum.js';
import type { ITicketRecord } from '../../interfaces/ticket.interface.js';
import type { UpdateTicketInput } from '../types/ticket.service.types.js';

export function buildCommentNotificationMessage(actorName: string): string {
  return `${actorName} commented on your ticket`;
}

export function buildStatusChangeNotificationMessage(
  actorName: string,
  status: TicketStatus,
): string {
  const statusLabel = TICKET_STATUS_LABELS[status] ?? status;
  return `${actorName} changed ticket status to ${statusLabel}`;
}

export function describeTicketChanges(
  existing: ITicketRecord,
  input: UpdateTicketInput,
): string | null {
  const parts: string[] = [];

  if (input.title !== undefined && input.title.trim() !== existing.title) {
    parts.push('title updated');
  }

  if (input.description !== undefined && input.description.trim() !== existing.description) {
    parts.push('description updated');
  }

  if (input.priority !== undefined && input.priority !== existing.priority) {
    parts.push(`priority set to ${TICKET_PRIORITY_LABELS[input.priority as TicketPriority] ?? input.priority}`);
  }

  if (input.assignedTo !== undefined) {
    const previousAssignee = existing.assignedTo ? String(existing.assignedTo) : null;
    const nextAssignee = input.assignedTo;

    if (previousAssignee !== nextAssignee) {
      parts.push(nextAssignee ? 'assignee updated' : 'ticket unassigned');
    }
  }

  return parts.length > 0 ? parts.join(', ') : null;
}

export function buildTicketUpdateNotificationMessage(
  actorName: string,
  summary: string,
): string {
  return `${actorName} updated your ticket: ${summary}`;
}
