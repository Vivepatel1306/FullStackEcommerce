import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUploadUrlDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  fileName: string;

  @IsIn(['image/jpeg', 'image/png', 'image/webp'])
  contentType: string;
}