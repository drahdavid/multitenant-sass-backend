import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, createLocationDto: CreateLocationDto) {
    return this.prisma.location.create({
      data: {
        ...createLocationDto,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.location.findMany({
      where: { tenantId },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.location.findFirst({
      where: { id, tenantId },
    });
  }

  async update(
    id: string,
    tenantId: string,
    updateLocationDto: UpdateLocationDto,
  ) {
    return this.prisma.location.update({
      where: { id, tenantId },
      data: updateLocationDto,
    });
  }

  async remove(id: string, tenantId: string) {
    return this.prisma.location.delete({
      where: { id, tenantId },
    });
  }
}
