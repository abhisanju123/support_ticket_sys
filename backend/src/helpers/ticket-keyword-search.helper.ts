import {
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
} from '../constants/enum.constants.js';
import { TICKET_PRIORITIES } from '../enums/ticket-priority.enum.js';
import { TICKET_STATUSES } from '../enums/ticket-status.enum.js';
import type { IUserRepository } from '../repositories/interfaces/user.repository.interface.js';

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const matchEnumValues = <T extends string>(
  keyword: string,
  values: readonly T[],
  labels: Record<T, string>,
): T[] => {
  const normalized = keyword.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  return values.filter((value) => {
    const label = labels[value].toLowerCase();
    const spacedValue = value.replace(/_/g, ' ').toLowerCase();

    return (
      label.includes(normalized) ||
      spacedValue.includes(normalized) ||
      normalized.includes(spacedValue) ||
      normalized.includes(label)
    );
  });
};

export const buildDateClauses = (keyword: string): Record<string, unknown>[] => {
  const trimmed = keyword.trim();
  const clauses: Record<string, unknown>[] = [];

  if (/^\d{4}$/.test(trimmed)) {
    const year = Number(trimmed);
    clauses.push({
      createdAt: {
        $gte: new Date(Date.UTC(year, 0, 1)),
        $lt: new Date(Date.UTC(year + 1, 0, 1)),
      },
    });
    clauses.push({
      updatedAt: {
        $gte: new Date(Date.UTC(year, 0, 1)),
        $lt: new Date(Date.UTC(year + 1, 0, 1)),
      },
    });
    return clauses;
  }

  const parsed = Date.parse(trimmed);

  if (Number.isNaN(parsed)) {
    return clauses;
  }

  const start = new Date(parsed);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(parsed);
  end.setUTCHours(23, 59, 59, 999);

  clauses.push({ createdAt: { $gte: start, $lte: end } });
  clauses.push({ updatedAt: { $gte: start, $lte: end } });

  return clauses;
};

/**
 * Builds MongoDB $or clauses for cross-field ticket keyword search.
 */
export async function buildTicketKeywordOrClauses(
  keyword: string,
  userRepository: IUserRepository,
): Promise<Record<string, unknown>[]> {
  const trimmed = keyword.trim();

  if (!trimmed) {
    return [];
  }

  const regex = new RegExp(escapeRegex(trimmed), 'i');
  const orClauses: Record<string, unknown>[] = [
    { title: regex },
    { description: regex },
  ];

  const ticketNumberText = trimmed.replace(/^#/, '');

  if (/^\d+$/.test(ticketNumberText)) {
    orClauses.push({ ticketNumber: Number(ticketNumberText) });
  }

  const matchedPriorities = matchEnumValues(
    trimmed,
    TICKET_PRIORITIES,
    TICKET_PRIORITY_LABELS,
  );

  if (matchedPriorities.length > 0) {
    orClauses.push({ priority: { $in: matchedPriorities } });
  }

  const matchedStatuses = matchEnumValues(trimmed, TICKET_STATUSES, TICKET_STATUS_LABELS);

  if (matchedStatuses.length > 0) {
    orClauses.push({ status: { $in: matchedStatuses } });
  }

  orClauses.push(...buildDateClauses(trimmed));

  const matchingUsers = await userRepository.findAll({
    filter: {
      $or: [{ name: regex }, { email: regex }],
    },
    projection: { _id: 1 },
  });

  if (matchingUsers.length > 0) {
    const userIds = matchingUsers.map((user) => user._id);
    orClauses.push({ createdBy: { $in: userIds } });
    orClauses.push({ assignedTo: { $in: userIds } });
  }

  return orClauses;
}
