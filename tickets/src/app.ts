import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { json } from "body-parser";
import { errorHandler, NotFoundError } from "@yonraztickets/common";

const app = express();
app.set("trust proxy", true); // traffic is proxied through ingress-nginx
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);


app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
