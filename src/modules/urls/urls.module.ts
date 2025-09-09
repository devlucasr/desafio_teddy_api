import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infra/db/prisma/prisma.module';
import { RedisModule } from '../../infra/cache/redis/redis.module';
import { UrlsService } from './application/urls.service';
import { UrlsController } from './presentation/http/urls.controller';
import { URLS_REPOSITORY } from './domain/repositories/urls.repository';
import { UrlsPrismaRepository } from './infrastructure/repositories/urls.repository.prisma';
import { AnonymousUrlCache } from './infrastructure/cache/anon-url.cache';
import { RedirectController } from './presentation/http/redirect.controller';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [UrlsController, RedirectController],
  providers: [
    AnonymousUrlCache,
    UrlsService,
    { provide: URLS_REPOSITORY, useClass: UrlsPrismaRepository }
  ],
  exports: [UrlsService]
})
export class UrlsModule {}
