import request from "supertest";
import { app } from "../../../app";
import { Ticket, TicketDocument } from "../../../models/Ticket";
import mongoose from "mongoose";

export async function createTicket() {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Shalom hanoch",
    price: 20,
  });
  await ticket.save();
  return ticket;
}

export async function makeOrder(cookie: string[], ticket: TicketDocument) {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id });
  return response;
}
