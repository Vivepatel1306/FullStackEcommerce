import { IsString } from "class-validator";

export class AddDocumentDto {
  @IsString() documentType!: string;
  @IsString() fileName!: string;
  @IsString() objectKey!: string;
}
