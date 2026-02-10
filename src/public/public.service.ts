import { Injectable, NotFoundException } from '@nestjs/common';
import { PreOrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePreOrderPublicDto } from './dto/create-preorder-public.dto';
import { PreOrderResponse } from '../preorders/interfaces/preorder.interfaces';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getStoreBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant || !tenant.isOpen) {
      throw new NotFoundException('Store not found or inactive');
    }

    return {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      isOpen: tenant.isOpen,
    };
  }

  async getStoreItems(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant || !tenant.isOpen) {
      throw new NotFoundException('Store not found or inactive');
    }

    return this.prisma.item.findMany({
      where: {
        tenantId: tenant.id,
        active: true,
      },
      select: {
        id: true,
        type: true,
        name: true,
        description: true,
        price: true,
        durationMin: true,
      },
    });
  }

  async createPreOrder(
    slug: string,
    createDto: CreatePreOrderPublicDto,
  ): Promise<PreOrderResponse> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant || !tenant.isOpen) {
      throw new NotFoundException('Store not found or inactive');
    }

    const { requestedStart, requestedEnd, ...rest } = createDto;

    const preOrder = await this.prisma.preOrder.create({
      data: {
        ...rest,
        tenantId: tenant.id,
        status: PreOrderStatus.SENT,
        requestedStart: requestedStart ? new Date(requestedStart) : null,
        requestedEnd: requestedEnd ? new Date(requestedEnd) : null,
      },
    });

    const message = this.buildWhatsAppMessage(preOrder);
    const whatsappPhone = '+5491234567890'; // Should come from tenant settings

    return {
      preorderId: preOrder.id,
      whatsapp: {
        phone: whatsappPhone,
        message,
      },
    };
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
