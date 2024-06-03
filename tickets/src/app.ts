import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { createTicketRouter } from "./routes/new";
import { json } from "body-parser";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@yonraztickets/common";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";
import { KafkaWrapper } from "./kafka/models/kafka-wrapper";
import { TicketCreatedProducer } from "./kafka/models/TicketCreatedProducer";

const app = express();
app.set("trust proxy", true); // traffic is proxied through ingress-nginx
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

const kafkaWrapper = new KafkaWrapper();
kafkaWrapper.connect("tickets", ["localhost:9092"]);
const ticketCreatedProducer = new TicketCreatedProducer(kafkaWrapper.client);
const mongoId = new mongoose.Types.ObjectId().toHexString();
ticketCreatedProducer.produce({
  id: "123",
  title: "concert",
  price: 20,
  userId: mongoId,
});

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
