import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import type { Tenant } from '@prisma/client';
import { PreOrdersService } from './preorders.service';
import { CreatePreOrderDto } from './dto/create-preorder.dto';
import { UpdatePreOrderStatusDto } from './dto/update-preorder-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';

@Controller('preorders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER, UserRole.EMPLOYEE)
export class PreOrdersController {
  constructor(private readonly preOrdersService: PreOrdersService) {}

  @Post()
  create(
    @Body() createPreOrderDto: CreatePreOrderDto,
    @CurrentTenant() tenant: Tenant,
  ) {
    return this.preOrdersService.create(tenant.id, createPreOrderDto);
  }

  @Get()
  findAll(@CurrentTenant() tenant: Tenant) {
    return this.preOrdersService.findAll(tenant.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.preOrdersService.findOne(id, tenant.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdatePreOrderStatusDto,
    @CurrentTenant() tenant: Tenant,
  ) {
    return this.preOrdersService.updateStatus(id, tenant.id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.preOrdersService.remove(id, tenant.id);
  }
}
