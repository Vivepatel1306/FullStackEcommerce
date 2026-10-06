import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderConsumer {
  supports(event: string) {
    return event.startsWith("order.");
  }
}
