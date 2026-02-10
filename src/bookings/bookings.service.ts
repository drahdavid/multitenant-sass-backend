import { Injectable, ConflictException } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, createBookingDto: CreateBookingDto) {
    const { startTime, endTime, employeeId, status, ...rest } =
      createBookingDto;

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Only check for overlap if status is CONFIRMED
    if (status === BookingStatus.CONFIRMED) {
      await this.checkForOverlap(tenantId, employeeId, start, end);
    }

    return this.prisma.booking.create({
      data: {
        ...rest,
        tenantId,
        employeeId,
        status,
        startTime: start,
        endTime: end,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.booking.findMany({
      where: { tenantId },
      orderBy: { startTime: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.booking.findFirst({
      where: { id, tenantId },
    });
  }

  async update(
    id: string,
    tenantId: string,
    updateBookingDto: UpdateBookingDto,
  ) {
    const { startTime, endTime, employeeId, status, ...rest } =
      updateBookingDto;

    const updateData: Record<string, unknown> = { ...rest };

    if (startTime) {
      updateData.startTime = new Date(startTime);
    }

    if (endTime) {
      updateData.endTime = new Date(endTime);
    }

    if (status) {
      updateData.status = status;
    }

    if (employeeId) {
      updateData.employeeId = employeeId;
    }

    // Check overlap if changing to CONFIRMED status or changing times/employee
    const needsOverlapCheck =
      status === BookingStatus.CONFIRMED ||
      startTime !== undefined ||
      endTime !== undefined ||
      employeeId !== undefined;

    if (needsOverlapCheck) {
      const existing = await this.findOne(id, tenantId);
      if (existing) {
        const finalStart = startTime ? new Date(startTime) : existing.startTime;
        const finalEnd = endTime ? new Date(endTime) : existing.endTime;
        const finalEmployeeId = employeeId ?? existing.employeeId;
        const finalStatus = status ?? existing.status;

        if (finalStatus === BookingStatus.CONFIRMED) {
          await this.checkForOverlap(
            tenantId,
            finalEmployeeId,
            finalStart,
            finalEnd,
            id,
          );
        }
      }
    }

    return this.prisma.booking.update({
      where: { id, tenantId },
      data: updateData,
    });
  }

  async remove(id: string, tenantId: string) {
    return this.prisma.booking.delete({
      where: { id, tenantId },
    });
  }

  private async checkForOverlap(
    tenantId: string,
    employeeId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string,
  ): Promise<void> {
    const overlapping = await this.prisma.booking.findFirst({
      where: {
        tenantId,
        employeeId,
        status: BookingStatus.CONFIRMED,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
      },
    });

    if (overlapping) {
      throw new ConflictException(
        'This employee already has a confirmed booking during this time',
      );
    }
  }
}
