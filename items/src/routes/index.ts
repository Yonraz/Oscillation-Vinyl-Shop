import express, { Request, Response } from "express";
import { Vinyl } from "../models/Vinyl";

const router = express.Router();

router.get("/api/vinyls", async (req: Request, res: Response) => {
  const vinyls = await Vinyl.find({ orderId: undefined });
  res.status(200).send(vinyls);
});

export { router as indexVinylRouter };
