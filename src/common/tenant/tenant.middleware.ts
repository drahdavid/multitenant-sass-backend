import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const host = req.get('host');

    if (!host) {
      throw new NotFoundException('Host header is required');
    }

    // Extract slug from subdomain or full domain
    // Examples:
    // - mystore.example.com -> mystore
    // - localhost:3001 -> localhost
    const slug = this.extractSlugFromHost(host);

    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant || !tenant.isOpen) {
      throw new NotFoundException('Store not found or inactive');
    }

    req.tenant = tenant;
    next();
  }

  private extractSlugFromHost(host: string): string {
    // Remove port from host
    const hostWithoutPort = host.split(':')[0];

    // For localhost or single-word domains, use as-is
    const parts = hostWithoutPort.split('.');

    if (parts.length === 1) {
      return parts[0];
    }

    // For subdomains, return the first part
    // mystore.example.com -> mystore
    return parts[0];
  }
}
