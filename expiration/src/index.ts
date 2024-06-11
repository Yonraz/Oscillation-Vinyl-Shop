import { kafkaWrapper } from "./kafka-wrapper";
import { OrderCreatedConsumer } from "./events/consumers/order-created-consumer";

const startup = async () => {
  if (!process.env.KAFKA_CLIENT_ID) {
    throw new Error("KAFKA_CLIENT_ID must be defined");
  }
  if (!process.env.KAFKA_BROKER) {
    throw new Error("KAFKA_BROKER must be defined");
  }
  try {
    await kafkaWrapper.connect(process.env.KAFKA_CLIENT_ID!, [
      process.env.KAFKA_BROKER!,
    ]);
    const orderCreatedConsumer = new OrderCreatedConsumer(kafkaWrapper.client);
    await orderCreatedConsumer.consume();
    console.log("Connected to Kafka");
  } catch (err) {
    console.error(err);
  }
};

startup();
