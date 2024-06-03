import { EachMessagePayload, Kafka } from "kafkajs";
import { TicketCreatedEvent } from "../events/TicketCreatedEvent";
import { BaseConsumer } from "./AbstractConsumer";
import { Topics } from "./TopicEnum";

export class TicketCreatedConsumer extends BaseConsumer<TicketCreatedEvent> {
    readonly topic: Topics.TicketCreated = Topics.TicketCreated;
    groupId = "payments-service";
    constructor(kafkaClient: Kafka) {
        super(kafkaClient);
    }
    onMessage(data: TicketCreatedEvent['data'], payload: EachMessagePayload): void {
        console.log("Event data!", data);
        console.log("Event payload!", payload);
    }
}
