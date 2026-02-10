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
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';

@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER, UserRole.EMPLOYEE)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(
    @Body() createLocationDto: CreateLocationDto,
    @CurrentTenant() tenant: Tenant,
  ) {
    return this.locationsService.create(tenant.id, createLocationDto);
  }

  @Get()
  findAll(@CurrentTenant() tenant: Tenant) {
    return this.locationsService.findAll(tenant.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.locationsService.findOne(id, tenant.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @CurrentTenant() tenant: Tenant,
  ) {
    return this.locationsService.update(id, tenant.id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.locationsService.remove(id, tenant.id);
  }
}
