import request from "supertest";
import { app } from "../../app";
import { createVinyl, makeOrder } from "./utils/helper_functions";

it("has a route listening to /api/orders for get requests", async () => {
  const response = await request(app).get("/api/orders").send({});
  expect(response.status).not.toEqual(404);
});

it("allows access only for signed in users", async () => {
  const response = await request(app).get("/api/orders").send({});
  expect(response.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", global.signup())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("fetches a list of orders for signed in user", async () => {
  // create 3 vinyls
  const vinyl1 = await createVinyl();
  const vinyl2 = await createVinyl();
  const vinyl3 = await createVinyl();

  const user1 = global.signup();
  const user2 = global.signup();
  // make order for user #1
  const order_1_response = await makeOrder(user1, vinyl1);
  expect(order_1_response.status).toEqual(201);
  // make 2 orders for user #2
  const order_2_response = await makeOrder(user2, vinyl2);
  expect(order_2_response.status).toEqual(201);
  const order_3_response = await makeOrder(user2, vinyl3);
  expect(order_3_response.status).toEqual(201);
  // get orders from user #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
  // destructure user2's orders
  const { body: orderTwo } = order_2_response;
  const { body: orderThree } = order_3_response;
  // compare with response
  expect(response.body[0]).toEqual(orderTwo);
  expect(response.body[1]).toEqual(orderThree);
});
