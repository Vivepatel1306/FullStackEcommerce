import { IsEmail, IsOptional, IsString } from "class-validator";
export class UpdateVendorDto {
  @IsOptional() @IsString() businessName?: string;
  @IsOptional() @IsString() legalName?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
}
