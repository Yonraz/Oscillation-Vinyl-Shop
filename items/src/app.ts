import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { createVinylRouter } from "./routes/new";
import { json } from "body-parser";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@yonraztickets/common";
import { showVinylRouter } from "./routes/show";
import { indexVinylRouter } from "./routes";
import { updateVinylRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true); // traffic is proxied through ingress-nginx
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);
app.use(currentUser);
app.use(createVinylRouter);
app.use(showVinylRouter);
app.use(indexVinylRouter);
app.use(updateVinylRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
