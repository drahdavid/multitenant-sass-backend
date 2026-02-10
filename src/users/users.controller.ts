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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@CurrentTenant() tenant: Tenant) {
    return this.usersService.findAll(tenant.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.usersService.findOne(id, tenant.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentTenant() tenant: Tenant,
  ) {
    return this.usersService.update(id, tenant.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.usersService.remove(id, tenant.id);
  }
}
