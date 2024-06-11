import {
  BaseConsumer,
  OrderCreatedEvent,
  OrderStatus,
  Topics,
} from "@yonraztickets/common";
import { Order } from "../../models/order";

export class OrderCreatedConsumer extends BaseConsumer<OrderCreatedEvent> {
  topic: Topics.OrderCreated = Topics.OrderCreated;
  groupId: string = "payments-service/order-created";
  async onMessage(data: OrderCreatedEvent["data"], msg: any) {
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      version: data.version,
      price: data.ticket.price,
      status: data.status,
    });
    await order.save();
  }
}
