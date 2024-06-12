import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  Genre,
  NotFoundError,
  UnauthorizedAccessError,
  requireAuth,
  validateRequest,
} from "@yonraztickets/common";
import { Vinyl } from "../models/Vinyl";
import { VinylUpdatedProducer } from "../events/Producers/VinylUpdatedProducer";
import { kafkaWrapper } from "../kafka-wrapper";

const router = express.Router();

router.put(
  "/api/vinyls/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
    body("genre").not().isEmpty().withMessage("Genre is required"),
    body("genre")
      .custom((input: string) => {
        return Object.values(Genre).includes(input);
      })
      .withMessage("Genre is invalid"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const vinyl = await Vinyl.findById(req.params.id);

    if (!vinyl) {
      throw new NotFoundError();
    }
    if (vinyl.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }
    if (vinyl.userId !== req.currentUser!.id) {
      throw new UnauthorizedAccessError();
    }
    vinyl.set({
      title: req.body.title,
      price: req.body.price,
      genre: req.body.genre,
      description: req.body.description || vinyl.description,
      imageUrl: req.body.imageUrl || vinyl.imageUrl,
    });
    await vinyl.save();
    const producer = new VinylUpdatedProducer(kafkaWrapper.client);
    await producer.produce({
      id: vinyl.id,
      title: vinyl.title,
      price: vinyl.price,
      userId: vinyl.userId,
      version: vinyl.version,
      genre: vinyl.genre,
      description: vinyl.description,
    });
    res.send(vinyl);
  }
);

export { router as updateVinylRouter };
