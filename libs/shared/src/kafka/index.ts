import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';
import { logger } from '../logger';
import { EventEnvelope } from '../interfaces';
import { envSchema } from '../config/env.schema';

const env = envSchema.parse(process.env);

const kafka = new Kafka({
  clientId: 'ecom-backend',
  brokers: env.KAFKA_BROKERS.split(',').map((broker) => broker.trim()),
});

let producerInstance: Producer | null = null;

export async function getKafkaProducer(): Promise<Producer> {
  if (!producerInstance) {
    producerInstance = kafka.producer({
      idempotent: true,
      maxInFlightRequests: 1,
      // Optional: add retries and other configurations
    });
    await producerInstance.connect();
    logger.info('Kafka producer connected');
  }
  return producerInstance;
}

export async function publish<T>(topic: string, event: EventEnvelope<T>): Promise<void> {
  const producer = await getKafkaProducer();
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: event.event_id,
          value: JSON.stringify(event),
        },
      ],
    });
    logger.debug(`Published event ${event.event_type} to topic ${topic} with ID ${event.event_id}`);
  } catch (error: any) {
    logger.error(`Failed to publish event ${event.event_type} to topic ${topic}: ${error.message}`);
    throw error; // Re-throw to allow upstream error handling
  }
}

export interface KafkaConsumerOptions {
  groupId: string;
  topics: string[];
  eachMessage: (payload: EachMessagePayload) => Promise<void>;
}

export function createKafkaConsumer(options: KafkaConsumerOptions): Consumer {
  const consumer = kafka.consumer({ groupId: options.groupId });

  async function connectAndRun() {
    await consumer.connect();
    await consumer.subscribe({ topics: options.topics, fromBeginning: false });
    await consumer.run({
      eachMessage: async (payload) => {
        try {
          await options.eachMessage(payload);
        } catch (error: any) {
          logger.error(
            `Error processing Kafka message for group ${options.groupId}: ${error.message}`,
            error.stack,
          );
        }
      },
    });
    logger.info(
      `Kafka consumer group ${options.groupId} subscribed to topics: ${options.topics.join(', ')}`,
    );
  }

  connectAndRun().catch((error) => {
    logger.error(
      `Failed to connect Kafka consumer group ${options.groupId}: ${error.message}`,
      error.stack,
    );
  });

  return consumer;
}
