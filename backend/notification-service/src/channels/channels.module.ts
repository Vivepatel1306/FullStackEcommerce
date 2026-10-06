import { Module } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { EmailService } from "./email/email.service";
import { PushService } from "./push/push.service";
import { SmsService } from "./sms/sms.service";

@Module({
  providers: [ChannelService, EmailService, SmsService, PushService],
  exports: [ChannelService],
})
export class ChannelsModule {}
