import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './database/connection.js';

const SHUTDOWN_TIMEOUT_MS = 10_000;

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(`[Server] Running on port ${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = (signal: NodeJS.Signals): void => {
    console.log(`[Server] Received ${signal}. Starting graceful shutdown...`);

    server.close(() => {
      void (async () => {
        try {
          await disconnectDatabase();
          console.log('[Server] Shutdown complete');
          process.exit(0);
        } catch (error) {
          console.error('[Server] Error during shutdown:', error);
          process.exit(1);
        }
      })();
    });

    setTimeout(() => {
      console.error('[Server] Forced shutdown after timeout');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((error) => {
  console.error('[Server] Failed to start:', error);
  process.exit(1);
});
