import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  // Database
  POSTGRES_URL: z.string().url(),
  CLICKHOUSE_URL: z.string().url(),

  // Caching
  REDIS_URL: z.string().url(),

  // Event Streaming
  KAFKA_BROKERS: z
    .string()
    .refine((val) => val.split(',').every((broker) => broker.trim().length > 0), {
      message: 'KAFKA_BROKERS must be a comma-separated string of non-empty broker addresses.',
    }),

  // Search
  ELASTIC_URL: z.string().url(),

  // Payments
  STRIPE_SECRET_KEY: z.string().min(1),

  // Authentication & Authorization
  KEYCLOAK_ISSUER: z.string().url(),

  // Storage (S3/Minio)
  S3_BUCKET: z.string().min(1),
  S3_ENDPOINT: z.string().url().optional(), // For Minio or other S3-compatible services
  MINIO_ACCESS_KEY: z.string().min(1).optional(), // For Minio local development
  MINIO_SECRET_KEY: z.string().min(1).optional(), // For Minio local development
});

export type Env = z.infer<typeof envSchema>;
