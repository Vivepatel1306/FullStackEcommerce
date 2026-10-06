import {
  NotificationChannel,
  NotificationStatus,
} from "../../../generated/prisma/enums";

export interface NotificationEntity {
  id: string;
  eventId: string;
  userId: string | null;
  recipient: string;
  type: string;
  channel: NotificationChannel;
  subject: string | null;
  body: string;
  status: NotificationStatus;
  attempts: number;
  lastError: string | null;
  createdAt: Date;
  sentAt: Date | null;
}
