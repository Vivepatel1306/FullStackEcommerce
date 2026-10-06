export interface NotificationPreferenceEntity {
  userId: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  updatedAt: Date;
}
