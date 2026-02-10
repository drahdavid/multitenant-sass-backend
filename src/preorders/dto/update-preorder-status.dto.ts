import { IsEnum } from 'class-validator';
import { PreOrderStatus } from '@prisma/client';

export class UpdatePreOrderStatusDto {
  @IsEnum(PreOrderStatus)
  status: PreOrderStatus;
}
