import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  IsEmail,
} from 'class-validator';
import { ItemType, PreOrderStatus } from '@prisma/client';

export class CreatePreOrderDto {
  @IsString()
  @IsOptional()
  itemId?: string;

  @IsEnum(ItemType)
  type: ItemType;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(PreOrderStatus)
  @IsOptional()
  status?: PreOrderStatus;

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

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
