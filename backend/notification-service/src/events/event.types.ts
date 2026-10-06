export interface DomainEvent {
  eventId: string;
  event: string;
  [key: string]: unknown;
}
