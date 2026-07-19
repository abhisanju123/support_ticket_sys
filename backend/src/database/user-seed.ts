import { env } from '../config/env.js';
import { User } from '../models/user.model.js';
import { hashPassword } from '../services/auth/auth.service.js';
import { logger } from '../utils/logger.util.js';

import { getSeedUsers } from './seed-users.data.js';

export interface SeedSummary {
  inserted: number;
  skipped: number;
  failed: number;
  passwordsSet: number;
}

export const seedUsers = async (): Promise<SeedSummary> => {
  const users = getSeedUsers();
  const summary: SeedSummary = { inserted: 0, skipped: 0, failed: 0, passwordsSet: 0 };
  const passwordHash = await hashPassword(env.SEED_DEFAULT_PASSWORD);

  logger.info('Starting user seed', { total: users.length, database: process.env.MONGODB_DB_NAME });

  for (const user of users) {
    const email = user.email.toLowerCase().trim();

    try {
      const result = await User.updateOne(
        { email },
        {
          $set: {
            name: user.name.trim(),
            role: user.role,
          },
          $setOnInsert: {
            email,
            passwordHash,
          },
        },
        { upsert: true, runValidators: true },
      );

      if (result.upsertedCount > 0) {
        summary.inserted += 1;
        logger.info('User inserted', { name: user.name, email, role: user.role });
        continue;
      }

      const passwordUpdate = await User.updateOne(
        {
          email,
          $or: [{ passwordHash: { $exists: false } }, { passwordHash: null }, { passwordHash: '' }],
        },
        { $set: { passwordHash } },
      );

      if (passwordUpdate.modifiedCount > 0) {
        summary.passwordsSet += 1;
        logger.info('Password set for existing user', { email });
      } else {
        summary.skipped += 1;
        logger.info('User already exists, skipped', { email });
      }
    } catch (error) {
      summary.failed += 1;
      logger.error('Failed to seed user', {
        name: user.name,
        email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return summary;
};
