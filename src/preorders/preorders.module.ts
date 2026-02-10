import { Module } from '@nestjs/common';
import { PreOrdersService } from './preorders.service';
import { PreOrdersController } from './preorders.controller';

@Module({
  controllers: [PreOrdersController],
  providers: [PreOrdersService],
  exports: [PreOrdersService],
})
export class PreOrdersModule {}
