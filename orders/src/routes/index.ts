import { requireAuth } from "@yonraztickets/common";
import express, { Request, Response } from "express";
import { Order } from "../models/Order";
const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    "vinyl"
  );

  res.send(orders);
});

export { router as indexOrderRouter };
