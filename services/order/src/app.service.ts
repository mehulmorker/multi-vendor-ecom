import { Injectable } from '@nestjs/common';
import { runInTransaction, outboxWrite, KAFKA_TOPICS } from '@multi-vendor-ecom/shared';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async createOrderAndPublishEvent(orderId: string, userId: string, totalAmount: number) {
    await runInTransaction(async (tx) => {
      // 1. Create the order in the database within the transaction
      const order = await tx.order.create({
        data: {
          id: orderId,
          user_id: userId,
          vendor_id: 'some-vendor-id', // Placeholder
          total_amount: totalAmount,
          status: 'pending',
        },
      });

      // 2. Write the 'order.placed' event to the Outbox table within the same transaction
      await outboxWrite(tx, 'Order', order.id, KAFKA_TOPICS.ORDER_PLACED, {
        orderId: order.id,
        userId: order.user_id,
        totalAmount: order.total_amount,
        status: order.status,
      });

      return order;
    });
  }
}
