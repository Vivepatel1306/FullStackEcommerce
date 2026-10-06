import { Injectable } from "@nestjs/common";
import { SqsService } from "../queue/sqs.service";
import { RetryPolicy } from "./retry-policy";

@Injectable()
export class RetryService {
  constructor(
    private readonly queue: SqsService,
    private readonly policy: RetryPolicy,
  ) {}

  defer(queueUrl: string, receiptHandle: string, receiveCount: number) {
    return this.queue.changeVisibility(
      queueUrl,
      receiptHandle,
      this.policy.visibilityDelay(receiveCount),
    );
  }
}
