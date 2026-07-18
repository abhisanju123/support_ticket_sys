import { TICKET_NUMBER_COUNTER_ID } from '../constants/sequence.constants.js';
import { Counter } from '../models/counter.model.js';
import { Ticket } from '../models/ticket.model.js';

const missingTicketNumberFilter = {
  $or: [{ ticketNumber: { $exists: false } }, { ticketNumber: null }],
};

const getMaxTicketNumberInDb = async (): Promise<number> => {
  const maxDoc = await Ticket.findOne({ ticketNumber: { $exists: true, $ne: null } })
    .sort({ ticketNumber: -1 })
    .select('ticketNumber')
    .lean()
    .exec();

  return maxDoc?.ticketNumber ?? 0;
};

const syncTicketNumberCounter = async (): Promise<number> => {
  const maxInDb = await getMaxTicketNumberInDb();

  const counter = await Counter.findByIdAndUpdate(
    TICKET_NUMBER_COUNTER_ID,
    { $max: { seq: maxInDb } },
    { new: true, upsert: true },
  )
    .lean()
    .exec();

  return counter?.seq ?? maxInDb;
};

export const getNextTicketNumber = async (): Promise<number> => {
  await syncTicketNumberCounter();

  const counter = await Counter.findByIdAndUpdate(
    TICKET_NUMBER_COUNTER_ID,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  )
    .lean()
    .exec();

  if (!counter) {
    throw new Error('Failed to allocate ticket number');
  }

  return counter.seq;
};

export const backfillTicketNumbersIfNeeded = async (): Promise<void> => {
  const missingCount = await Ticket.countDocuments(missingTicketNumberFilter).exec();

  if (missingCount === 0) {
    return;
  }

  let nextNumber = await getMaxTicketNumberInDb();

  const ticketsWithoutNumber = await Ticket.find(missingTicketNumberFilter)
    .sort({ createdAt: 1 })
    .select('_id')
    .lean()
    .exec();

  for (const ticket of ticketsWithoutNumber) {
    nextNumber += 1;
    await Ticket.updateOne({ _id: ticket._id }, { $set: { ticketNumber: nextNumber } }).exec();
  }

  await Counter.findByIdAndUpdate(
    TICKET_NUMBER_COUNTER_ID,
    { $set: { seq: nextNumber } },
    { upsert: true },
  ).exec();

  console.log(`[Database] Assigned ticket numbers to ${ticketsWithoutNumber.length} existing ticket(s)`);
};

export const repairDuplicateTicketNumbersIfNeeded = async (): Promise<void> => {
  const duplicateGroups = await Ticket.aggregate<{ _id: number; count: number }>([
    { $match: { ticketNumber: { $exists: true, $ne: null } } },
    { $group: { _id: '$ticketNumber', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]).exec();

  if (duplicateGroups.length === 0) {
    return;
  }

  let maxNumber = await getMaxTicketNumberInDb();
  let repairedCount = 0;

  for (const group of duplicateGroups) {
    const tickets = await Ticket.find({ ticketNumber: group._id })
      .sort({ createdAt: 1 })
      .select('_id')
      .lean()
      .exec();

    for (let index = 1; index < tickets.length; index += 1) {
      maxNumber += 1;
      await Ticket.updateOne(
        { _id: tickets[index]._id },
        { $set: { ticketNumber: maxNumber } },
      ).exec();
      repairedCount += 1;
    }
  }

  await Counter.findByIdAndUpdate(
    TICKET_NUMBER_COUNTER_ID,
    { $set: { seq: maxNumber } },
    { upsert: true },
  ).exec();

  console.log(
    `[Database] Repaired ${repairedCount} duplicate ticket number assignment(s) across ${duplicateGroups.length} group(s)`,
  );
};

export const initializeTicketNumbers = async (): Promise<void> => {
  await backfillTicketNumbersIfNeeded();
  await repairDuplicateTicketNumbersIfNeeded();
  await syncTicketNumberCounter();
};
