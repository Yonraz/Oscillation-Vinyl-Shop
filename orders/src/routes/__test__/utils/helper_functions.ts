import request from "supertest";
import { app } from "../../../app";
import { Vinyl, VinylDocument } from "../../../models/Vinyl";
import mongoose from "mongoose";

export async function createVinyl() {
  const vinyl = Vinyl.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Shalom hanoch",
    price: 20,
  });
  await vinyl.save();
  return vinyl;
}

export async function makeOrder(cookie: string[], vinyl: VinylDocument) {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ vinylId: vinyl.id });
  return response;
}
