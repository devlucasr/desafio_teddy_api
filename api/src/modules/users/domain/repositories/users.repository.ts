import type { CreateUserInput, DomainUser } from '../types/user-types';

export interface IUsersRepository {
  create(data: CreateUserInput): Promise<DomainUser>
  findByEmail(email: string): Promise<DomainUser | null>
}

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');
