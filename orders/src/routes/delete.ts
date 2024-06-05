import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  requireAuth,
  NotFoundError,
  UnauthorizedAccessError,
  OrderStatus,
} from "@yonraztickets/common";
import { Order } from "../models/Order";
import { OrderCancelledProducer } from "../events/producers/OrderUpdatedProducer";
import { kafkaWrapper } from "../kafka-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedAccessError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    const producer = new OrderCancelledProducer(kafkaWrapper.client);
    producer.produce({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send();
  }
);

export { router as deleteOrderRouter };
