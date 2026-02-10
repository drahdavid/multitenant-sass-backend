import { Injectable } from '@nestjs/common';
import { PreOrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePreOrderDto } from './dto/create-preorder.dto';
import { UpdatePreOrderStatusDto } from './dto/update-preorder-status.dto';
import { PreOrderResponse } from './interfaces/preorder.interfaces';

@Injectable()
export class PreOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tenantId: string,
    createPreOrderDto: CreatePreOrderDto,
  ): Promise<PreOrderResponse> {
    const { requestedStart, requestedEnd, status, ...rest } = createPreOrderDto;

    const preOrder = await this.prisma.preOrder.create({
      data: {
        ...rest,
        tenantId,
        status: status ?? PreOrderStatus.SENT,
        requestedStart: requestedStart ? new Date(requestedStart) : null,
        requestedEnd: requestedEnd ? new Date(requestedEnd) : null,
      },
      include: {
        tenant: true,
      },
    });

    // Generate WhatsApp message
    const message = this.buildWhatsAppMessage(preOrder);

    // In a real scenario, you'd get the tenant's WhatsApp number from settings
    // For MVP, we'll use a placeholder
    const whatsappPhone = '+5491234567890'; // This should come from tenant settings

    return {
      preorderId: preOrder.id,
      whatsapp: {
        phone: whatsappPhone,
        message,
      },
    };
  }

  async findAll(tenantId: string) {
    return this.prisma.preOrder.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.preOrder.findFirst({
      where: { id, tenantId },
    });
  }

  async updateStatus(
    id: string,
    tenantId: string,
    updateDto: UpdatePreOrderStatusDto,
  ) {
    return this.prisma.preOrder.update({
      where: { id, tenantId },
      data: { status: updateDto.status },
    });
  }

  async remove(id: string, tenantId: string) {
    return this.prisma.preOrder.delete({
      where: { id, tenantId },
    });
  }

  private buildWhatsAppMessage(preOrder): string {
    const parts: string[] = [];

    parts.push('Hola! Tengo una consulta/reserva:');

    if (preOrder.customerName) {
      parts.push(`Nombre: ${preOrder.customerName}`);
    }

    if (preOrder.type) {
      parts.push(
        `Tipo: ${preOrder.type === 'PRODUCT' ? 'Producto' : 'Servicio'}`,
      );
    }

    if (preOrder.notes) {
      parts.push(`Detalles: ${preOrder.notes}`);
    }

    if (preOrder.requestedStart) {
      const startDate = new Date(preOrder.requestedStart).toLocaleString(
        'es-AR',
      );
      parts.push(`Fecha solicitada: ${startDate}`);
    }

    parts.push(`ID de referencia: ${preOrder.id}`);

    return parts.join('\n');
  }
}
