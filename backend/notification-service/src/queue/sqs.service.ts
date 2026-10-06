import { Injectable } from "@nestjs/common";
import {
  ChangeMessageVisibilityCommand,
  DeleteMessageCommand,
  MessageSystemAttributeName,
  ReceiveMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { awsConfig } from "../config/aws.config";

@Injectable()
export class SqsService {
  private readonly client = new SQSClient({ region: awsConfig.region });

  receive(queueUrl: string) {
    return this.client.send(
      new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 60,
        MessageSystemAttributeNames: [
          MessageSystemAttributeName.ApproximateReceiveCount,
        ],
      }),
    );
  }

  acknowledge(queueUrl: string, receiptHandle: string) {
    return this.client.send(
      new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      }),
    );
  }

  changeVisibility(
    queueUrl: string,
    receiptHandle: string,
    visibilityTimeout: number,
  ) {
    return this.client.send(
      new ChangeMessageVisibilityCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
        VisibilityTimeout: visibilityTimeout,
      }),
    );
  }

  destroy() {
    this.client.destroy();
  }
}
