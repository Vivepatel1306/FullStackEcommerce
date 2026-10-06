import { Module } from "@nestjs/common";
import { EventsModule } from "../events/events.module";
import { RetryPolicy } from "../retry/retry-policy";
import { RetryService } from "../retry/retry.service";
import { SqsConsumer } from "./sqs.consumer";
import { SqsService } from "./sqs.service";

@Module({
  imports: [EventsModule],
  providers: [SqsService, SqsConsumer, RetryPolicy, RetryService],
})
export class QueueModule {}
