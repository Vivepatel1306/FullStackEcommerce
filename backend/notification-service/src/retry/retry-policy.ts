import { Injectable } from "@nestjs/common";
@Injectable()
export class RetryPolicy {
  visibilityDelay(receiveCount: number) {
    return Math.min(2 ** Math.max(receiveCount - 1, 0) * 5, 300);
  }
}
