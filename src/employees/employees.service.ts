import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, createEmployeeDto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.employee.findMany({
      where: { tenantId },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.employee.findFirst({
      where: { id, tenantId },
    });
  }

  async update(
    id: string,
    tenantId: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.prisma.employee.update({
      where: { id, tenantId },
      data: updateEmployeeDto,
    });
  }

  async remove(id: string, tenantId: string) {
    return this.prisma.employee.delete({
      where: { id, tenantId },
    });
  }
}
