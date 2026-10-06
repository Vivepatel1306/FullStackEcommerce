import { Module } from "@nestjs/common";
import { ChannelsModule } from "../channels/channels.module";
import { PreferenceService } from "./services/preference.service";
import { TemplateService } from "./services/template.service";
import { NotificationService } from "./services/notification.service";
import { NotificationController } from "./controllers/notification.controller";

@Module({
  imports: [ChannelsModule],
  controllers: [NotificationController],
  providers: [NotificationService, PreferenceService, TemplateService],
  exports: [NotificationService, PreferenceService, TemplateService],
})
export class NotificationsModule {}
