import { Injectable } from '@nestjs/common';

import type { IUsersRepository } from '../../domain/repositories/users.repository';
import type { CreateUserInput, DomainUser } from '../../domain/types/user-types';
import { PrismaService } from '../../../../infra/db/prisma/prisma.service';

@Injectable()
export class UsersRepositoryPrisma implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserInput): Promise<DomainUser> {
    const u = await this.prisma.user.create({ data });
    return this.toDomain(u);
  }

  async findByEmail(email: string): Promise<DomainUser | null> {
    const u = await this.prisma.user.findUnique({ where: { email } });
    return u ? this.toDomain(u) : null;
  }

  private toDomain(u: {
    id: string
    name: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
  }): DomainUser {
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      password: u.password,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      deletedAt: u.deletedAt
    };
  }
}
