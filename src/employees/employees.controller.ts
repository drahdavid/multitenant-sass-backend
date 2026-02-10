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
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER, UserRole.EMPLOYEE)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CurrentTenant() tenant: Tenant,
  ) {
    return this.employeesService.create(tenant.id, createEmployeeDto);
  }

  @Get()
  findAll(@CurrentTenant() tenant: Tenant) {
    return this.employeesService.findAll(tenant.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.employeesService.findOne(id, tenant.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @CurrentTenant() tenant: Tenant,
  ) {
    return this.employeesService.update(id, tenant.id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.employeesService.remove(id, tenant.id);
  }
}
