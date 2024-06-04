import { requireAuth } from "@yonraztickets/common";
import express, { Request, Response } from "express";
const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  res.status(200).send();
});

export { router as indexOrderRouter };
