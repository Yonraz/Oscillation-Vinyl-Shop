import request from "supertest";
import { app } from "../../app";
import { createTicket, makeOrder } from "./utils/helper_functions";

it("has a route listening to /api/tickets for post requests", async () => {
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
  // create 3 tickets
  const ticket1 = await createTicket();
  const ticket2 = await createTicket();
  const ticket3 = await createTicket();

  const user1 = global.signup();
  const user2 = global.signup();
  // make order for user #1
  const order_1_response = await makeOrder(user1, ticket1);
  expect(order_1_response.status).toEqual(201);
  // make 2 orders for user #2
  const order_2_response = await makeOrder(user2, ticket2);
  expect(order_2_response.status).toEqual(201);
  const order_3_response = await makeOrder(user2, ticket3);
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
