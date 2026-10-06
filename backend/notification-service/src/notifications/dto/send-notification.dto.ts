import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";
import { NotificationChannel } from "../../../generated/prisma/enums";

export class SendNotificationDto {
  @IsString()
  eventId: string;

  @IsString()
  type: string;

  @IsString()
  recipient: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(NotificationChannel, { each: true })
  channels?: NotificationChannel[];
}
