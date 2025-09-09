import { Request } from 'express';

export type JwtUser = {
  userId: string
  email?: string
}

export interface AuthenticatedRequest extends Request {
  user?: JwtUser
}
