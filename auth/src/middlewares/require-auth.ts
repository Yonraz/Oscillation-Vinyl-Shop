import { Request, Response, NextFunction } from "express";
import { UnauthorizedAccessError } from "../errors/unauthorized-access-error";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new UnauthorizedAccessError();
  }
  next();
};
