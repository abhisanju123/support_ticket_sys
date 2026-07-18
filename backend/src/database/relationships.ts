import { COLLECTIONS } from '../constants/collection.constants.js';

export type RelationshipCardinality = 'one-to-many' | 'many-to-one';

export interface RelationshipDefinition {
  from: string;
  to: string;
  cardinality: RelationshipCardinality;
  foreignKey: string;
  localKey?: string;
  optional: boolean;
  description: string;
}

/**
 * Entity relationship map for the Support Ticket Management System.
 *
 * User ──creates──▶ Ticket        (1:N, required)
 * User ◀──assignedTo── Ticket     (1:N, optional)
 * Ticket ──has many──▶ Comment    (1:N, required)
 * Comment ──belongs to──▶ Ticket  (N:1, required)
 * Comment ──createdBy──▶ User     (N:1, required)
 */
export const ENTITY_RELATIONSHIPS: RelationshipDefinition[] = [
  {
    from: COLLECTIONS.USERS,
    to: COLLECTIONS.TICKETS,
    cardinality: 'one-to-many',
    foreignKey: 'createdBy',
    optional: false,
    description: 'A user creates many tickets; each ticket has exactly one creator.',
  },
  {
    from: COLLECTIONS.USERS,
    to: COLLECTIONS.TICKETS,
    cardinality: 'one-to-many',
    foreignKey: 'assignedTo',
    optional: true,
    description: 'A user may be assigned many tickets; each ticket has at most one assignee.',
  },
  {
    from: COLLECTIONS.TICKETS,
    to: COLLECTIONS.COMMENTS,
    cardinality: 'one-to-many',
    foreignKey: 'ticketId',
    optional: false,
    description: 'A ticket has many comments; each comment belongs to one ticket.',
  },
  {
    from: COLLECTIONS.COMMENTS,
    to: COLLECTIONS.TICKETS,
    cardinality: 'many-to-one',
    foreignKey: 'ticketId',
    localKey: 'ticketId',
    optional: false,
    description: 'Each comment belongs to exactly one ticket.',
  },
  {
    from: COLLECTIONS.COMMENTS,
    to: COLLECTIONS.USERS,
    cardinality: 'many-to-one',
    foreignKey: 'createdBy',
    localKey: 'createdBy',
    optional: false,
    description: 'Each comment is authored by exactly one user.',
  },
];

export const RELATIONSHIP_GRAPH = {
  user: {
    creates: { collection: COLLECTIONS.TICKETS, foreignKey: 'createdBy' as const },
    assignedTo: { collection: COLLECTIONS.TICKETS, foreignKey: 'assignedTo' as const },
    commentsCreated: { collection: COLLECTIONS.COMMENTS, foreignKey: 'createdBy' as const },
  },
  ticket: {
    creator: { collection: COLLECTIONS.USERS, localKey: 'createdBy' as const },
    assignee: { collection: COLLECTIONS.USERS, localKey: 'assignedTo' as const },
    comments: { collection: COLLECTIONS.COMMENTS, foreignKey: 'ticketId' as const },
  },
  comment: {
    ticket: { collection: COLLECTIONS.TICKETS, localKey: 'ticketId' as const },
    author: { collection: COLLECTIONS.USERS, localKey: 'createdBy' as const },
  },
} as const;
