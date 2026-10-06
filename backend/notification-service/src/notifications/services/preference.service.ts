import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { NotificationPreferenceDto } from "../dto/notification-preference.dto";

@Injectable()
export class PreferenceService {
  constructor(private readonly prisma: PrismaService) {}

  get(userId: string) {
    return this.prisma.notificationPreference.findUnique({ where: { userId } });
  }

  set(userId: string, preferences: NotificationPreferenceDto) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      create: { userId, ...preferences },
      update: preferences,
    });
  }

  async allows(userId: string | undefined, channel: "EMAIL" | "SMS" | "PUSH") {
    if (!userId) return true;
    const preference = await this.get(userId);
    if (!preference) return true;
    const key = channel.toLowerCase() as "email" | "sms" | "push";
    return preference[key];
  }
}
