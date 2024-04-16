import { Router } from "express";

const router = Router();

router.get("/api/users/signin", (req, res) => {
  res.send("Hi there! this is sign in");
});

export { router as signInRouter };
