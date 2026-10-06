import { Injectable, Logger } from "@nestjs/common";
import {
  NotificationChannel,
  NotificationStatus,
} from "../../../generated/prisma/enums";
import { ChannelService } from "../../channels/channel.service";
import { PrismaService } from "../../database/prisma.service";
import { SendNotificationDto } from "../dto/send-notification.dto";
import { PreferenceService } from "./preference.service";

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly preferences: PreferenceService,
    private readonly channels: ChannelService,
  ) {}

  async send(input: SendNotificationDto) {
    const results = [];
    for (const channel of input.channels ?? [NotificationChannel.EMAIL]) {
      const notification = await this.prisma.notification.upsert({
        where: {
          eventId_recipient_channel: {
            eventId: input.eventId,
            recipient: input.recipient,
            channel,
          },
        },
        create: {
          eventId: input.eventId,
          userId: input.userId,
          recipient: input.recipient,
          type: input.type,
          channel,
          subject: input.subject,
          body: input.body,
        },
        update: {},
      });

      if (
        notification.status === NotificationStatus.SENT ||
        notification.status === NotificationStatus.SKIPPED
      ) {
        results.push({
          id: notification.id,
          channel,
          status: notification.status,
        });
        continue;
      }

      if (!(await this.preferences.allows(input.userId, channel))) {
        const skipped = await this.prisma.notification.update({
          where: { id: notification.id },
          data: { status: NotificationStatus.SKIPPED },
        });
        results.push({ id: skipped.id, channel, status: skipped.status });
        continue;
      }

      try {
        await this.channels.send(channel, {
          recipient: input.recipient,
          subject: input.subject ?? input.type,
          body: input.body,
        });
        const sent = await this.prisma.notification.update({
          where: { id: notification.id },
          data: {
            status: NotificationStatus.SENT,
            attempts: { increment: 1 },
            lastError: null,
            sentAt: new Date(),
          },
        });
        results.push({ id: sent.id, channel, status: sent.status });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: {
            status: NotificationStatus.FAILED,
            attempts: { increment: 1 },
            lastError: message,
          },
        });
        this.logger.error(
          `Delivery failed for ${input.eventId}/${channel}: ${message}`,
        );
        throw error;
      }
    }
    return results;
  }

  listForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }
}
