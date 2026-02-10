import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';
import { LocationsModule } from './locations/locations.module';
import { ItemsModule } from './items/items.module';
import { BookingsModule } from './bookings/bookings.module';
import { PreOrdersModule } from './preorders/preorders.module';
import { PublicModule } from './public/public.module';
import { HealthModule } from './health/health.module';
import { TenantMiddleware } from './common/tenant/tenant.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrismaModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    EmployeesModule,
    LocationsModule,
    ItemsModule,
    BookingsModule,
    PreOrdersModule,
    PublicModule,
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
