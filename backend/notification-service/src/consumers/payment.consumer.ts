import { Injectable } from "@nestjs/common";

@Injectable()
export class PaymentConsumer {
  supports(event: string) {
    return event.startsWith("payment.");
  }
}
