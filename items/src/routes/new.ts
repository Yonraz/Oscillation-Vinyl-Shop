import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Genre, requireAuth, validateRequest } from "@yonraztickets/common";
import { Vinyl } from "../models/Vinyl";
import { VinylCreatedProducer as VinylCreatedProducer } from "../events/Producers/VinylCreatedProducer";
import { kafkaWrapper } from "../kafka-wrapper";

const router = express.Router();

router.post(
  "/api/vinyls",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 }) // is greater than 0
      .withMessage("Price must be greater than 0"),
    body("genre").not().isEmpty().withMessage("Genre is required"),
    body("genre")
      .custom((input: string) => {
        return Object.values(Genre).includes(input);
      })
      .withMessage("Genre is invalid"),
    body("imageUrl").not().isEmpty().withMessage("Image URL is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, genre, description, imageUrl } = req.body;
    let desc = description || "";
    const vinyl = Vinyl.build({
      title,
      price,
      userId: req.currentUser!.id,
      genre,
      imageUrl,
      description: desc,
    });
    await vinyl.save();
    const producer = new VinylCreatedProducer(kafkaWrapper.client);
    await producer.produce({
      id: vinyl.id,
      title: vinyl.title,
      price: vinyl.price,
      userId: vinyl.userId,
      version: vinyl.version,
      genre: vinyl.genre,
      description: vinyl.description,
    });
    res.status(201).send(vinyl);
  }
);

export { router as createVinylRouter };
