import { IsBoolean } from "class-validator";

export class NotificationPreferenceDto {
  @IsBoolean()
  email: boolean;

  @IsBoolean()
  sms: boolean;

  @IsBoolean()
  push: boolean;
}
