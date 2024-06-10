import { BaseConsumer, OrderCreatedEvent, Topics } from "@yonraztickets/common";
import { EachMessagePayload } from "kafkajs";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedConsumer extends BaseConsumer<OrderCreatedEvent> {
  topic: Topics.OrderCreated = Topics.OrderCreated;
  groupId = "expiration-service/order-created";
  async onMessage(
    data: OrderCreatedEvent["data"],
    payload: EachMessagePayload
  ) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting ${delay} milliseconds to process the job`);
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
  }
}
