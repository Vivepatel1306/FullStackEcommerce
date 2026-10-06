import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { notificationConfig } from "../config/notification.config";
import { EventRouterService } from "../events/event-router.service";
import { RetryService } from "../retry/retry.service";
import { SqsService } from "./sqs.service";

@Injectable()
export class SqsConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SqsConsumer.name);
  private running = false;

  constructor(
    private readonly queue: SqsService,
    private readonly router: EventRouterService,
    private readonly retries: RetryService,
  ) {}

  onModuleInit() {
    const queueUrl = notificationConfig.queueUrl;
    if (!queueUrl) {
      this.logger.log(
        "SQS_NOTIFICATION_QUEUE_URL is not set; event polling is disabled",
      );
      return;
    }
    this.running = true;
    void this.consumeLoop(queueUrl);
  }

  onModuleDestroy() {
    this.running = false;
    this.queue.destroy();
  }

  private async consumeLoop(queueUrl: string) {
    while (this.running) {
      try {
        const response = await this.queue.receive(queueUrl);
        for (const message of response.Messages ?? []) {
          if (!message.ReceiptHandle || !message.Body) continue;
          await this.processMessage(
            queueUrl,
            message.ReceiptHandle,
            message.Body,
            message.MessageId,
            Number(message.Attributes?.ApproximateReceiveCount ?? 1),
          );
        }
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        this.logger.error(`SQS polling failed: ${reason}`);
      }
    }
  }

  private async processMessage(
    queueUrl: string,
    receiptHandle: string,
    body: string,
    messageId: string | undefined,
    receiveCount: number,
  ) {
    try {
      const parsed = JSON.parse(body) as Record<string, unknown>;
      const eventName = parsed.event ?? parsed.type;
      if (typeof eventName !== "string") {
        throw new Error("Message is missing event/type");
      }
      await this.router.route({
        ...parsed,
        eventId: String(
          parsed.eventId ?? parsed.id ?? messageId ?? `${eventName}:${body}`,
        ),
        event: eventName,
      });
      await this.queue.acknowledge(queueUrl, receiptHandle);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Event processing failed (receive ${receiveCount}): ${reason}`,
      );
      await this.retries.defer(queueUrl, receiptHandle, receiveCount);
    }
  }
}
