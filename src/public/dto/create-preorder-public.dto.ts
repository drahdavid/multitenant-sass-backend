import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  IsEmail,
} from 'class-validator';
import { ItemType } from '@prisma/client';

export class CreatePreOrderPublicDto {
  @IsString()
  @IsOptional()
  itemId?: string;

  @IsEnum(ItemType)
  type: ItemType;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsDateString()
  @IsOptional()
  requestedStart?: string;

  @IsDateString()
  @IsOptional()
  requestedEnd?: string;
}
