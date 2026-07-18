import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  MONGODB_DNS_SERVERS: z.string().optional(),
  MONGODB_DB_NAME: z.string().min(1).optional(),
  MONGODB_MAX_RETRIES: z.coerce.number().int().positive().default(5),
  MONGODB_RETRY_DELAY_MS: z.coerce.number().int().positive().default(5000),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().min(1).default('30m'),
  SEED_DEFAULT_PASSWORD: z.string().min(8).default('Password123!'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[Config] Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export type Env = z.infer<typeof envSchema>;
