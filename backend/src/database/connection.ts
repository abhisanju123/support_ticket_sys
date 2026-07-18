import dns from 'node:dns';

import mongoose from 'mongoose';

import { env } from '../config/env.js';

const DEFAULT_MONGODB_SRV_DNS_SERVERS = ['8.8.8.8', '1.1.1.1'];

const configureMongoSrvDns = (): void => {
  if (!env.MONGODB_URI.startsWith('mongodb+srv://')) {
    return;
  }

  const configuredServers =
    env.MONGODB_DNS_SERVERS?.split(',')
      .map((server) => server.trim())
      .filter(Boolean) ?? [];

  const supplementalServers =
    configuredServers.length > 0
      ? configuredServers
      : process.platform === 'win32'
        ? DEFAULT_MONGODB_SRV_DNS_SERVERS
        : [];

  if (supplementalServers.length === 0) {
    return;
  }

  const dnsServers = [...new Set([...supplementalServers, ...dns.getServers()])];
  dns.setServers(dnsServers);
  console.log('[Database] Configured supplemental DNS for Atlas SRV lookup');
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const registerConnectionListeners = (): void => {
  mongoose.connection.on('connected', () => {
    console.log('[Database] MongoDB connection established');
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[Database] MongoDB reconnected');
  });

  mongoose.connection.on('error', (error) => {
    console.error('[Database] MongoDB connection error:', error.message);
  });
};

const connectWithRetry = async (attempt = 1): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
    });
    console.log('[Database] Connected to MongoDB successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (attempt >= env.MONGODB_MAX_RETRIES) {
      console.error(
        `[Database] Failed to connect after ${env.MONGODB_MAX_RETRIES} attempts: ${message}`,
      );
      throw error;
    }

    console.warn(
      `[Database] Connection attempt ${attempt}/${env.MONGODB_MAX_RETRIES} failed: ${message}`,
    );
    console.warn(`[Database] Retrying in ${env.MONGODB_RETRY_DELAY_MS}ms...`);

    await sleep(env.MONGODB_RETRY_DELAY_MS);
    await connectWithRetry(attempt + 1);
  }
};

export const connectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    console.log('[Database] Already connected to MongoDB');
    return;
  }

  configureMongoSrvDns();
  registerConnectionListeners();
  await connectWithRetry();

  const { initializeTicketNumbers } = await import('./ticket-number.js');
  await initializeTicketNumbers();
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    console.log('[Database] MongoDB connection already closed');
    return;
  }

  await mongoose.disconnect();
  console.log('[Database] MongoDB connection closed gracefully');
};

export const getDatabaseConnectionState = (): string => {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return states[mongoose.connection.readyState] ?? 'unknown';
};
