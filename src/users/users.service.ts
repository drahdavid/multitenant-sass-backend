import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    const passwordHash = await hash(password, SALT_ROUNDS);

    return this.prisma.user.create({
      data: {
        ...userData,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        role: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        role: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.user.findFirst({
      where: { id, tenantId },
      select: {
        id: true,
        email: true,
        role: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, tenantId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id, tenantId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        role: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string, tenantId: string) {
    return this.prisma.user.delete({
      where: { id, tenantId },
    });
  }
}
