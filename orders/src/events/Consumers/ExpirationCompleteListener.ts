import {
  BaseConsumer,
  ExpirationCompleteEvent,
  OrderStatus,
  Topics,
} from "@yonraztickets/common";
import { EachMessagePayload } from "kafkajs";
import { Order } from "../../models/Order";
import { OrderCancelledProducer } from "../producers/OrderUpdatedProducer";

export class ExpirationCompleteConsumer extends BaseConsumer<ExpirationCompleteEvent> {
  topic: Topics.ExpirationComplete = Topics.ExpirationComplete;
  groupId: string = "orders-service/expiration-complete";
  async onMessage(
    data: ExpirationCompleteEvent["data"],
    message: EachMessagePayload
  ) {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    await new OrderCancelledProducer(this.client).produce({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
  }
}
