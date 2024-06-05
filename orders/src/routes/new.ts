import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  requireAuth,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@yonraztickets/common";
import { Ticket } from "../models/Ticket";
import { Order } from "../models/Order";
import { OrderCreatedProducer } from "../events/producers/OrderCreatedProducer";
import { kafkaWrapper } from "../kafka-wrapper";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("Ticket Id is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // find ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    // make sure ticket isnt reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("An order for this ticket already exists");
    }
    // set 15 min expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    // build order and save to database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt,
      ticket,
    });
    await order.save();
    // emit an order created event
    const producer = new OrderCreatedProducer(kafkaWrapper.client);
    producer.produce({
      id: order.id,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      userId: order.userId,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
