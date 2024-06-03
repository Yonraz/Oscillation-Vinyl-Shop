import "express-async-errors";
import mongoose from "mongoose";
import { app } from "./app";
import { KafkaWrapper } from "./kafka/models/kafka-wrapper";
import { TicketCreatedProducer } from "./kafka/models/TicketCreatedProducer";

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
    const kafkaWrapper = new KafkaWrapper();
    console.log("Connecting to Kafka...");
    await kafkaWrapper.connect(process.env.KAFKA_CLIENT_ID!, [
      process.env.KAFKA_BROKER!,
    ]);
    const ticketCreatedProducer = new TicketCreatedProducer(
      kafkaWrapper.client
    );
    const mongoId = new mongoose.Types.ObjectId().toHexString();
    await ticketCreatedProducer.produce({
      id: "123",
      title: "concert",
      price: 20,
      userId: mongoId,
    });
  } catch (err) {
    console.error(err);
  }
  try {
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
