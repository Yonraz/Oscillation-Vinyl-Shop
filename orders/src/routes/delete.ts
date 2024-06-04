import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, requireAuth } from "@yonraztickets/common";

const router = express.Router();

router.delete('/api/orders/:id', requireAuth, [], validateRequest, async (req: Request, res: Response) => {

});

export { router as deleteOrderRouter };