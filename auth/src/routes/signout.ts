import { Router } from "express";

const router = Router();

router.get("/api/users/signout", (req, res) => {
  res.send("Hi there!");
});

export { router as signOutRouter };
