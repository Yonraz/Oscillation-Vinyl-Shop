import Queue from "bull";
import { ExpirationCompleteProducer } from "../events/producers/expiration-complete-producer";
import { kafkaWrapper } from "../kafka-wrapper";

interface Payload {
  orderId: string;
}

export const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  await new ExpirationCompleteProducer(kafkaWrapper.client).produce({
    orderId: job.data.orderId,
  });
});
