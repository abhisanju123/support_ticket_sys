import { COLLECTIONS } from '../constants/collection.constants.js';

export interface IndexDefinition {
  keys: Record<string, 1 | -1>;
  options?: {
    unique?: boolean;
    name?: string;
    sparse?: boolean;
  };
  reason: string;
}

export const INDEX_DEFINITIONS: Record<string, IndexDefinition[]> = {
  [COLLECTIONS.USERS]: [
    {
      keys: { email: 1 },
      options: { unique: true, name: 'users_email_unique' },
      reason:
        'Fast user lookup by email when resolving ticket creators, assignees, and comment authors.',
    },
    {
      keys: { role: 1 },
      options: { name: 'users_role' },
      reason: 'Filter users by role (e.g. list support agents available for ticket assignment).',
    },
  ],
  [COLLECTIONS.TICKETS]: [
    {
      keys: { ticketNumber: 1 },
      options: { unique: true, name: 'tickets_ticketNumber_unique' },
      reason: 'Fast lookup and display of sequential human-readable ticket IDs.',
    },
    {
      keys: { createdBy: 1, createdAt: -1 },
      options: { name: 'tickets_createdBy_createdAt' },
      reason:
        'Retrieve tickets created by a specific user, sorted newest first ("My Tickets" view).',
    },
    {
      keys: { assignedTo: 1, status: 1 },
      options: { name: 'tickets_assignedTo_status', sparse: true },
      reason:
        'Agent workload queries — find tickets assigned to a user filtered by status. Sparse because assignedTo is optional on new tickets.',
    },
    {
      keys: { status: 1, priority: 1, createdAt: -1 },
      options: { name: 'tickets_status_priority_createdAt' },
      reason:
        'Support dashboard — filter by status and priority, sorted by creation date. Supports future combined search/filter.',
    },
    {
      keys: { status: 1, createdAt: -1 },
      options: { name: 'tickets_status_createdAt' },
      reason: 'Filter tickets by lifecycle status alone (e.g. all OPEN tickets, newest first).',
    },
    {
      keys: { priority: 1, createdAt: -1 },
      options: { name: 'tickets_priority_createdAt' },
      reason:
        'Filter tickets by urgency level (e.g. all CRITICAL tickets) without requiring a status filter.',
    },
    {
      keys: { assignedTo: 1, createdAt: -1 },
      options: { name: 'tickets_assignedTo_createdAt', sparse: true },
      reason:
        'List all tickets assigned to a user sorted by date, regardless of status. Sparse because unassigned tickets omit this field.',
    },
    {
      keys: { createdAt: -1 },
      options: { name: 'tickets_createdAt' },
      reason: 'Global ticket listing sorted by newest first for admin views and pagination.',
    },
  ],
  [COLLECTIONS.COMMENTS]: [
    {
      keys: { ticketId: 1, createdAt: 1 },
      options: { name: 'comments_ticketId_createdAt' },
      reason:
        'Load a ticket discussion thread in chronological order — the most frequent comment query.',
    },
    {
      keys: { createdBy: 1, createdAt: -1 },
      options: { name: 'comments_createdBy_createdAt' },
      reason: 'Retrieve comments authored by a specific user, sorted newest first.',
    },
  ],
};
