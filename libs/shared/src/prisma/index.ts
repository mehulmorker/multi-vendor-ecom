import { PrismaClient, Prisma } from '../../prisma/generated/client';
import { logger } from '../logger';
import { EventEnvelope } from '../interfaces';
import { generateUUID } from '../utils';

// PrismaClient is attached to the `global` object in development to prevent
// hot-reloading from creating multiple instances of the client.
// Learn more: https://pris.ly/d/help/prisma-client-references-in-development

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['warn', 'error'], // Use Prisma's default logging for warn and error
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Removed custom prisma.$on() handlers; relying on default logging for now.
// If custom logging is needed, a custom log middleware can be implemented via prisma.$use().

export type PrismaTx = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

/**
 * Helper to run a Prisma transaction.
 * @param callback The function to execute within the transaction.
 * @returns The result of the callback function.
 */
export async function runInTransaction<T>(callback: (tx: PrismaTx) => Promise<T>): Promise<T> {
  return prisma.$transaction(callback);
}

/**
 * Writes an event to the Outbox table.
 * @param client The PrismaClient instance or a transaction client.
 * @param aggregateType The type of the aggregate (e.g., 'Order', 'Product').
 * @param aggregateId The ID of the aggregate.
 * @param eventType The type of the event (e.g., 'order.placed', 'product.updated').
 * @param payload The event payload.
 */
export async function outboxWrite<T>(
  client: PrismaTx,
  aggregateType: string,
  aggregateId: string,
  eventType: string,
  payload: T,
): Promise<void> {
  const eventEnvelope: EventEnvelope<T> = {
    event_type: eventType,
    event_id: generateUUID(),
    schema_version: '1.0',
    timestamp: new Date().toISOString(),
    payload,
  };

  await client.outbox.create({
    data: {
      aggregate_type: aggregateType,
      aggregate_id: aggregateId,
      event_type: eventType,
      payload: eventEnvelope as unknown as Prisma.InputJsonValue,
    },
  });
  logger.debug(`Wrote event ${eventType} for ${aggregateType}:${aggregateId} to outbox.`);
}
