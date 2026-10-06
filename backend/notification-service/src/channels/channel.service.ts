import { Injectable } from "@nestjs/common";
import { NotificationChannel } from "../../generated/prisma/enums";
import { EmailService } from "./email/email.service";
import { PushService } from "./push/push.service";
import { SmsService } from "./sms/sms.service";

export interface ChannelMessage {
  recipient: string;
  subject: string;
  body: string;
}

@Injectable()
export class ChannelService {
  constructor(
    private readonly email: EmailService,
    private readonly sms: SmsService,
    private readonly push: PushService,
  ) {}

  send(channel: NotificationChannel, message: ChannelMessage) {
    switch (channel) {
      case NotificationChannel.EMAIL:
        return this.email.send(message);
      case NotificationChannel.SMS:
        return this.sms.send(message);
      case NotificationChannel.PUSH:
        return this.push.send(message);
    }
  }
}
