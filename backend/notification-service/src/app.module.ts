import { Module } from "@nestjs/common";
import { ChannelsModule } from "./channels/channels.module";
import { ConsumersModule } from "./consumers/consumers.module";
import { DatabaseModule } from "./database/database.module";
import { EventsModule } from "./events/events.module";
import { HealthController } from "./health/health.controller";
import { NotificationsModule } from "./notifications/notifications.module";
import { QueueModule } from "./queue/queue.module";

@Module({
  imports: [
    DatabaseModule,
    ChannelsModule,
    NotificationsModule,
    ConsumersModule,
    EventsModule,
    QueueModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
