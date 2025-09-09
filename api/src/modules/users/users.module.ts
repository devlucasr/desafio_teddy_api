import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersController } from './presentation/http/users.controller';
import { USERS_REPOSITORY } from './domain/repositories/users.repository';
import { UsersRepositoryPrisma } from './infrastructure/repositories/users.repository.prisma';
import { PrismaModule } from '../../infra/db/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: USERS_REPOSITORY, useClass: UsersRepositoryPrisma }
  ],
  exports: [UsersService, USERS_REPOSITORY]
})
export class UsersModule {}
