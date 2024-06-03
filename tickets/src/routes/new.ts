import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@yonraztickets/common";
import { Ticket } from "../models/Ticket";
import { TicketCreatedProducer } from "../events/Producers/TicketCreatedProducer";
import { kafkaWrapper } from "../kafka-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 }) // is greater than 0
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    const producer = new TicketCreatedProducer(kafkaWrapper.client);
    console.log(producer);
    await producer.produce({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
