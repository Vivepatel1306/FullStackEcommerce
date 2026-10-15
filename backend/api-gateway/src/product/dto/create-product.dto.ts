import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  category: string;

  @IsOptional()
@IsString()
@MaxLength(500)
imageKey?: string;
}