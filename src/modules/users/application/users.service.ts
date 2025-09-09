import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IUsersRepository } from '../domain/repositories/users.repository';
import { USERS_REPOSITORY } from '../domain/repositories/users.repository';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import type { PublicUser, CreateUserInput } from '../domain/types/user-types';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly repo: IUsersRepository
  ) {}

  async create(dto: CreateUserInput): Promise<PublicUser> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.repo.create({
      name: dto.name.trim(),
      email: dto.email.toLowerCase().trim(),
      password: hashed
    });

    return this.toPublic(user);
  }

  private toPublic(u: User): PublicUser {
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      deletedAt: u.deletedAt
    };
  }
}
