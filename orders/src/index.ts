import "express-async-errors";
import mongoose from "mongoose";
import { app } from "./app";
import { kafkaWrapper } from "./kafka-wrapper";
import { TicketCreatedConsumer } from "./events/Consumers/TicketCreatedConsumer";
import { TicketUpdatedConsumer } from "./events/Consumers/TicketUpdatedConsumer";
import { Topics } from "@yonraztickets/common";
import { PaymentCreatedConsumer } from "./events/Consumers/PaymentCreatedConsumer";
import { ExpirationCompleteConsumer } from "./events/Consumers/ExpirationCompleteConsumer";

const startup = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.KAFKA_CLIENT_ID) {
    throw new Error("KAFKA_CLIENT_ID must be defined");
  }
  if (!process.env.KAFKA_BROKER) {
    throw new Error("KAFKA_BROKER must be defined");
  }
  try {
    await kafkaWrapper.connect(process.env.KAFKA_CLIENT_ID!, [
      process.env.KAFKA_BROKER!,
    ]);

    const ticketCreatedConsumer = new TicketCreatedConsumer(
      kafkaWrapper.client
    );
    await ticketCreatedConsumer.consume();
    const ticketUpdatedConsumer = new TicketUpdatedConsumer(
      kafkaWrapper.client
    );
    await ticketUpdatedConsumer.consume();
    const expirationCompleteConsumer = new ExpirationCompleteConsumer(
      kafkaWrapper.client
    );
    await expirationCompleteConsumer.consume();
    const paymentCreatedConsumer = new PaymentCreatedConsumer(
      kafkaWrapper.client
    );
    await paymentCreatedConsumer.consume();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

startup();
