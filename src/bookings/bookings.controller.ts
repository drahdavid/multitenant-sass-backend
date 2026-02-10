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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER, UserRole.EMPLOYEE)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentTenant() tenant: Tenant,
  ) {
    return this.bookingsService.create(tenant.id, createBookingDto);
  }

  @Get()
  findAll(@CurrentTenant() tenant: Tenant) {
    return this.bookingsService.findAll(tenant.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.bookingsService.findOne(id, tenant.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @CurrentTenant() tenant: Tenant,
  ) {
    return this.bookingsService.update(id, tenant.id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.bookingsService.remove(id, tenant.id);
  }
}
