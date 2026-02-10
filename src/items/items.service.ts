import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, createItemDto: CreateItemDto) {
    return this.prisma.item.create({
      data: {
        ...createItemDto,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string, activeOnly = false) {
    return this.prisma.item.findMany({
      where: {
        tenantId,
        ...(activeOnly ? { active: true } : {}),
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.item.findFirst({
      where: { id, tenantId },
    });
  }

  async update(id: string, tenantId: string, updateItemDto: UpdateItemDto) {
    return this.prisma.item.update({
      where: { id, tenantId },
      data: updateItemDto,
    });
  }

  async remove(id: string, tenantId: string) {
    return this.prisma.item.delete({
      where: { id, tenantId },
    });
  }
}
