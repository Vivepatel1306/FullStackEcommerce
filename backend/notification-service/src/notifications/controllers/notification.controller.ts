import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { NotificationPreferenceDto } from "../dto/notification-preference.dto";
import { SendNotificationDto } from "../dto/send-notification.dto";
import { NotificationService } from "../services/notification.service";
import { PreferenceService } from "../services/preference.service";

@Controller("notifications")
export class NotificationController {
  constructor(
    private readonly notifications: NotificationService,
    private readonly preferences: PreferenceService,
  ) {}

  @Post()
  send(@Body() input: SendNotificationDto) {
    return this.notifications.send(input);
  }

  @Get()
  list(@Query("userId") userId: string) {
    if (!userId?.trim()) {
      throw new BadRequestException("userId is required");
    }
    return this.notifications.listForUser(userId);
  }

  @Get("preferences/:userId")
  getPreferences(@Param("userId") userId: string) {
    return this.preferences.get(userId);
  }

  @Put("preferences/:userId")
  setPreferences(
    @Param("userId") userId: string,
    @Body() input: NotificationPreferenceDto,
  ) {
    return this.preferences.set(userId, input);
  }
}
