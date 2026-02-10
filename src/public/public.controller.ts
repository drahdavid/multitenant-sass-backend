import { Controller, Get, Post, Body, Param, Header } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PublicService } from './public.service';
import { CreatePreOrderPublicDto } from './dto/create-preorder-public.dto';

@Controller('public/store')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get(':slug')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Header('Cache-Control', 'private, no-store')
  getStore(@Param('slug') slug: string) {
    return this.publicService.getStoreBySlug(slug);
  }

  @Get(':slug/items')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Header('Cache-Control', 'private, no-store')
  getStoreItems(@Param('slug') slug: string) {
    return this.publicService.getStoreItems(slug);
  }

  @Post(':slug/preorders')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Header('Cache-Control', 'private, no-store')
  createPreOrder(
    @Param('slug') slug: string,
    @Body() createDto: CreatePreOrderPublicDto,
  ) {
    return this.publicService.createPreOrder(slug, createDto);
  }
}
