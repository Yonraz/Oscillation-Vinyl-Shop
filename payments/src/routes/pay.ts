import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Payment } from "../models/payment";
import { PaymentCreatedProducer } from "../events/producers/PaymentCreatedProducer";
import { kafkaWrapper } from "../kafka-wrapper";
import { stripe } from "../stripe";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import bodyParser from "body-parser";

const router = express.Router();

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (request: Request, response: Response) => {
    const signature = request.headers["stripe-signature"];
    if (!signature) {
      response.status(400).send("Signature not provided");
      return;
    }
    const event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("Event received:", event);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata!.orderId;
      const payment = Payment.build({
        orderId,
        stripeId: session.id,
      });
      await payment.save();

      const producer = new PaymentCreatedProducer(kafkaWrapper.client);
      await producer.produce({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
      });
      console.log(`Session ${session.id} was successful!`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.json({ received: true });
  }
);

export { router as stripeWebhookRouter };
