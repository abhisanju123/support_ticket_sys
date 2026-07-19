import { buildDateClauses, matchEnumValues } from '../../helpers/ticket-keyword-search.helper.js';
import { TICKET_PRIORITIES } from '../../enums/ticket-priority.enum.js';
import { TICKET_STATUSES } from '../../enums/ticket-status.enum.js';
import {
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
} from '../../constants/enum.constants.js';

describe('ticket keyword search helpers', () => {
  it('matches priority labels', () => {
    expect(
      matchEnumValues('high', TICKET_PRIORITIES, TICKET_PRIORITY_LABELS),
    ).toContain('high');
  });

  it('matches status labels with spaces', () => {
    expect(
      matchEnumValues('in progress', TICKET_STATUSES, TICKET_STATUS_LABELS),
    ).toContain('in_progress');
  });

  it('builds date range clauses for a parseable date', () => {
    const clauses = buildDateClauses('2026-07-18');
    expect(clauses).toHaveLength(2);
    expect(clauses[0]).toHaveProperty('createdAt');
    expect(clauses[1]).toHaveProperty('updatedAt');
  });

  it('builds year clauses for a four-digit year', () => {
    const clauses = buildDateClauses('2026');
    expect(clauses).toHaveLength(2);
  });
});
