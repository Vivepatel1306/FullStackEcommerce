import { Injectable } from "@nestjs/common";

@Injectable()
export class UserConsumer {
  supports(event: string) {
    return event.startsWith("user.") || event.startsWith("auth.");
  }
}
