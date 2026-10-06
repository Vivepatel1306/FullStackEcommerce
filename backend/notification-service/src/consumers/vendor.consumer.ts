import { Injectable } from "@nestjs/common";

@Injectable()
export class VendorConsumer {
  supports(event: string) {
    return event.startsWith("vendor.");
  }
}
