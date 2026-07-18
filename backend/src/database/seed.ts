import '../config/env.js';

import { logger } from '../utils/logger.util.js';

import { connectDatabase, disconnectDatabase } from './connection.js';
import { seedUsers } from './user-seed.js';

const runSeed = async (): Promise<void> => {
  try {
    await connectDatabase();

    const summary = await seedUsers();

    if (summary.failed > 0) {
      logger.error('User seed completed with failures', { ...summary });
      process.exit(1);
    }

    logger.info('User seed completed successfully', { ...summary });
  } catch (error) {
    logger.error('User seed failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
};

void runSeed();
