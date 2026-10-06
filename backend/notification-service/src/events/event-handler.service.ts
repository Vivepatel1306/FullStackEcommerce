import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { NotificationChannel } from "../../generated/prisma/enums";
import { NotificationService } from "../notifications/services/notification.service";
import { TemplateService } from "../notifications/services/template.service";
import { DomainEvent } from "./event.types";

@Injectable()
export class EventHandlerService {
  constructor(
    private readonly notifications: NotificationService,
    private readonly templates: TemplateService,
  ) {}

  async handle(event: DomainEvent) {
    const userId = this.stringValue(
      event.userId ??
        event.customerId ??
        event.ownerId ??
        event.recipientUserId,
    );
    const destinations = [
      {
        channel: NotificationChannel.EMAIL,
        recipient: this.stringValue(event.recipientEmail ?? event.email),
      },
      {
        channel: NotificationChannel.SMS,
        recipient: this.stringValue(event.phone ?? event.phoneNumber),
      },
      {
        channel: NotificationChannel.PUSH,
        recipient: this.stringValue(event.pushEndpointArn),
      },
    ].filter(
      (entry): entry is { channel: NotificationChannel; recipient: string } =>
        Boolean(entry.recipient),
    );
    if (destinations.length === 0) {
      throw new UnprocessableEntityException(
        `Event ${event.event} has no email, phone, or push destination`,
      );
    }

    const results = [];
    for (const destination of destinations) {
      const template = this.templates.render(
        event.event,
        event,
        destination.channel,
      );
      results.push(
        await this.notifications.send({
          eventId: event.eventId,
          type: event.event,
          userId,
          recipient: destination.recipient,
          subject: template.subject,
          body: template.body,
          channels: [destination.channel],
        }),
      );
    }
    return results;
  }

  private stringValue(value: unknown): string | undefined {
    return typeof value === "string" && value.length > 0 ? value : undefined;
  }
}
