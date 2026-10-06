import { Module } from "@nestjs/common";
import { ConsumersModule } from "../consumers/consumers.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { EventHandlerService } from "./event-handler.service";
import { EventRouterService } from "./event-router.service";

@Module({
  imports: [ConsumersModule, NotificationsModule],
  providers: [EventHandlerService, EventRouterService],
  exports: [EventRouterService],
})
export class EventsModule {}
