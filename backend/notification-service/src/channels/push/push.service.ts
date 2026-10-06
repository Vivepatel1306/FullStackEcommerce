import { Injectable } from "@nestjs/common";
import { PublishCommand } from "@aws-sdk/client-sns";
import { pushProvider } from "./push.provider";
import { PushMessage } from "./push.types";

@Injectable()
export class PushService {
  send(message: PushMessage) {
    return pushProvider.send(
      new PublishCommand({
        TargetArn: message.recipient,
        Message: JSON.stringify({
          default: message.body,
          GCM: JSON.stringify({
            notification: { title: message.subject, body: message.body },
          }),
          APNS: JSON.stringify({
            aps: { alert: { title: message.subject, body: message.body } },
          }),
        }),
        MessageStructure: "json",
      }),
    );
  }
}
