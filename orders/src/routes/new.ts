import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  requireAuth,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@yonraztickets/common";
import { Vinyl } from "../models/Vinyl";
import { Order } from "../models/Order";
import { OrderCreatedProducer } from "../events/producers/OrderCreatedProducer";
import { kafkaWrapper } from "../kafka-wrapper";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [body("vinylId").not().isEmpty().withMessage("Vinyl Id is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { vinylId } = req.body;
    // find vinyl
    const vinyl = await Vinyl.findById(vinylId);
    if (!vinyl) {
      throw new NotFoundError();
    }
    // make sure vinyl isnt reserved
    const isReserved = await vinyl.isReserved();
    if (isReserved) {
      throw new BadRequestError("An order for this vinyl already exists");
    }
    // set 15 min expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    // build order and save to database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt,
      vinyl,
    });
    await order.save();
    // emit an order created event
    const producer = new OrderCreatedProducer(kafkaWrapper.client);
    producer.produce({
      id: order.id,
      version: order.version,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      userId: order.userId,
      vinyl: {
        id: order.vinyl.id,
        price: order.vinyl.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
