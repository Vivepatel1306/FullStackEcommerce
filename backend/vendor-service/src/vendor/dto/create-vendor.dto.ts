import { Type } from "class-transformer";
import { IsEmail, IsOptional, IsString, ValidateNested } from "class-validator";
class VendorAddressDto {
  @IsString() line1!: string;
  @IsOptional() @IsString() line2?: string;
  @IsString() city!: string;
  @IsString() state!: string;
  @IsString() postalCode!: string;
  @IsString() country!: string;
}
export class CreateVendorDto {
  @IsString() ownerId!: string;
  @IsString() businessName!: string;
  @IsString() legalName!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() phone?: string;
  @ValidateNested() @Type(() => VendorAddressDto) address!: VendorAddressDto;
}
