import {
  BaseConsumer,
  OrderStatus,
  PaymentCreatedEvent,
  Topics,
} from "@yonraztickets/common";
import { EachMessagePayload } from "kafkajs";
import { Order } from "../../models/Order";

export class PaymentCreatedConsumer extends BaseConsumer<PaymentCreatedEvent> {
  readonly topic = Topics.PaymentCreated;
  readonly groupId = "orders-service/payment-created";
  async onMessage(data: PaymentCreatedEvent["data"], msg: EachMessagePayload) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    
    order.set({ status: OrderStatus.Complete });
    await order.save();
  }
}
