import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type { IUsersRepository } from '../../users/domain/repositories/users.repository';
import { USERS_REPOSITORY } from '../../users/domain/repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepo: IUsersRepository,
    private readonly jwt: JwtService
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, name: user.name };
    const access_token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m'
    });
    return { access_token };
  }
}
