import {
  BaseConsumer,
  OrderCancelledEvent,
  OrderStatus,
  Topics,
} from "@yonraztickets/common";
import { Order } from "../../models/order";

export class OrderCancelledConsumer extends BaseConsumer<OrderCancelledEvent> {
  topic: Topics.OrderCancelled = Topics.OrderCancelled;
  groupId = "payments-service/order-cancelled";

  async onMessage(data: OrderCancelledEvent["data"], msg: any) {
    const { id } = data;
    const order = await Order.findOne({ _id: id, version: data.version - 1 });
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({ status: OrderStatus.Cancelled });

    await order.save();
  }
}
