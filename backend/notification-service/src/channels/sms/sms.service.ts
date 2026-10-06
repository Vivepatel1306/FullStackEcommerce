import { Injectable } from "@nestjs/common";
import { PublishCommand } from "@aws-sdk/client-sns";
import { smsProvider } from "./sms.provider";
import { SmsMessage } from "./sms.types";

@Injectable()
export class SmsService {
  send(message: SmsMessage) {
    return smsProvider.send(
      new PublishCommand({
        PhoneNumber: message.recipient,
        Message: message.body,
      }),
    );
  }
}
