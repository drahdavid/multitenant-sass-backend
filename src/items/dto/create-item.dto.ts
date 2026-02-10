import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';
import { ItemType } from '@prisma/client';

export class CreateItemDto {
  @IsString()
  @IsOptional()
  locationId?: string;

  @IsEnum(ItemType)
  type: ItemType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  durationMin?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
