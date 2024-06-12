import request from "supertest";
import { app } from "../../app";
import { Genre } from "@yonraztickets/common";

function createVinyl() {
  return request(app).post("/api/vinyls").set("Cookie", global.signup()).send({
    title: "title",
    price: 20,
    genre: Genre.Classical,
    imageUrl: "image url",
  });
}

it("fetches a list of vinyls", async () => {
  //create 3 vinyls
  await createVinyl();
  await createVinyl();
  await createVinyl();
  // get all vinyls
  const response = await request(app).get("/api/vinyls").send().expect(200);

  expect(response.body.length).toEqual(3);
});
