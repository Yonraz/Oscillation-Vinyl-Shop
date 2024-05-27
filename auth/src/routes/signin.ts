import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "@yonraztickets/common";
import { User } from "../models/user";
import { BadRequestError } from "@yonraztickets/common";
import { Password } from "../utils/password";
import jwt from "jsonwebtoken";

const router = Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Must provide a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }
    const user = existingUser.toJSON();
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };

    res.send(user);
  }
);

export { router as signInRouter };
