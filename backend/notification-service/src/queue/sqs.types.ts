import { DomainEvent } from "../events/event.types";

export interface SqsEventMessage extends DomainEvent {
  eventId: string;
}
