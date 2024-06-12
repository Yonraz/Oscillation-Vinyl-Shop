import express, { Request, Response } from "express";
import { NotFoundError } from "@yonraztickets/common";
import { Vinyl } from "../models/Vinyl";

const router = express.Router();

router.get("/api/vinyls/:id", async (req: Request, res: Response) => {
  const vinyl = await Vinyl.findById(req.params.id);
  if (!vinyl) {
    throw new NotFoundError();
  }
  res.status(200).send(vinyl);
});

export { router as showVinylRouter };
