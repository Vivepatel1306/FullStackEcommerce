import { Injectable, Logger } from "@nestjs/common";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { VendorEvent } from "./vendor.events";

@Injectable()
export class VendorEventPublisher {
  private readonly logger = new Logger(VendorEventPublisher.name);
  private readonly client = new SQSClient({
    region: process.env.AWS_REGION ?? "us-east-1",
  });

  async publish(event: VendorEvent): Promise<void> {
    const queueUrl = process.env.SQS_VENDOR_EVENTS_QUEUE_URL;
    if (!queueUrl) {
      this.logger.debug(`SQS queue is not configured; skipped ${event.event}`);
      return;
    }
    await this.client.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(event),
      }),
    );
  }
}
