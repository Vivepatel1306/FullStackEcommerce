import { IsEnum, IsOptional, IsString } from "class-validator";
import { DocumentStatus } from "../enums/document-status.enum";
import { VendorStatus } from "../enums/vendor-status.enum";
export class VendorReviewDto {
  @IsEnum(VendorStatus) status!: VendorStatus;
  @IsOptional() @IsString() rejectionReason?: string;
  @IsOptional() @IsEnum(DocumentStatus) documentStatus?: DocumentStatus;
}
