import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import type { JwtUser } from '../interfaces/authenticated-request';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const hasAuthHeader = typeof req.headers['authorization'] === 'string';
    if (!hasAuthHeader) return true;
    return super.canActivate(context);
  }

  handleRequest<TUser = JwtUser | null>(
    err: unknown,
    user: JwtUser | false | null
  ): TUser {
    if (err || !user) return null as TUser;
    return user as unknown as TUser;
  }
}
