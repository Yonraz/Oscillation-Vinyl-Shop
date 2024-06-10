import {
  Topics,
  BaseProducer,
  ExpirationCompleteEvent,
} from "@yonraztickets/common";

export class ExpirationCompleteProducer extends BaseProducer<ExpirationCompleteEvent> {
  topic: Topics.ExpirationComplete = Topics.ExpirationComplete;
}
