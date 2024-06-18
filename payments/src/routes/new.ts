import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  UnauthorizedAccessError,
  requireAuth,
} from "@yonraztickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedProducer } from "../events/producers/PaymentCreatedProducer";
import { kafkaWrapper } from "../kafka-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("orderId").not().isEmpty()],
  async (req: Request, res: Response) => {
    const { orderId, name } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedAccessError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Order is cancelled");
    }
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: order.price * 100,
      product_data: {
        name,
      },
    });
    const paymentData = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        orderId: order.id,
      },
      return_url: `${req.headers.origin}/orders?session_id={CHECKOUT_SESSION_ID}`,
    });
    res.status(200).send({ client_secret: paymentData.client_secret });
  }
);

export { router as createChargeRouter };
