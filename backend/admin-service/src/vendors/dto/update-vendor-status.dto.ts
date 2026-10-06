import { IsEnum } from "class-validator";

export enum VendorStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export class UpdateVendorStatusDto {
  @IsEnum(VendorStatus)
  status!: VendorStatus;
}
