import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import type { Tenant } from '@prisma/client';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';

@Controller('items')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER, UserRole.EMPLOYEE)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(
    @Body() createItemDto: CreateItemDto,
    @CurrentTenant() tenant: Tenant,
  ) {
    return this.itemsService.create(tenant.id, createItemDto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenant: Tenant,
    @Query('activeOnly') activeOnly?: string,
  ) {
    return this.itemsService.findAll(tenant.id, activeOnly === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.itemsService.findOne(id, tenant.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @CurrentTenant() tenant: Tenant,
  ) {
    return this.itemsService.update(id, tenant.id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.itemsService.remove(id, tenant.id);
  }
}
