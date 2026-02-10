import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Tenant } from '@prisma/client';
import { RequestWithTenant } from '../interfaces/request-with-tenant.interface';

export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Tenant => {
    const request = ctx.switchToHttp().getRequest<RequestWithTenant>();
    return request.tenant;
  },
);
