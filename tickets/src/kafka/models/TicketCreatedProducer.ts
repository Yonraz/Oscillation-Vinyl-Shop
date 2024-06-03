import { TicketCreatedEvent } from "../events/TicketCreatedEvent";
import { BaseProducer } from "./AbstractProducer";
import { Topics } from "./TopicEnum";

export class TicketCreatedProducer extends BaseProducer<TicketCreatedEvent> {
  topic: Topics.TicketCreated = Topics.TicketCreated;
  
}