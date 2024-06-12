import request from "supertest";
import { app } from "../../app";
import { getInvalidId } from "../../utils/utils";
import { Genre } from "@yonraztickets/common";

it("returns 404 if the vinyl is not found", async () => {
  const id = getInvalidId();
  await request(app).get(`/api/vinyls/${id}`).send().expect(404);
});

it("returns the vinyl if the vinyl is found", async () => {
  const title = "stevie wonder";
  const price = 208;

  const response = await request(app)
    .post("/api/vinyls")
    .set("Cookie", global.signup())
    .send({
      title,
      price,
      genre: Genre.Jazz,
      imageUrl: "image url",
    });

  console.log(response.body);

  const vinylResponse = await request(app)
    .get(`/api/vinyls/${response.body.id}`)
    .send()
    .expect(200);

  expect(vinylResponse.body.title).toEqual(title);
  expect(vinylResponse.body.price).toEqual(price);
});
