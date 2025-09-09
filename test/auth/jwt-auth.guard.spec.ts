import { JwtAuthGuard } from '../../src/common/guards/jwt-auth.guard';
import { makeHttpContext } from '../helpers/execution-context.mock';
import type { Request, Response, NextFunction } from 'express';

jest.mock('passport', () => ({
  authenticate:
    (_name: string, _opts: unknown, callback: (err: unknown, user: unknown, info?: unknown) => void) =>
      (req: Request, _res: Response, next: NextFunction) => {
        callback(null, { sub: 1 }, null);
        next();
      }
}));

describe('JwtAuthGuard', () => {
  it('aceita com Bearer token válido', async () => {
    const guard = new JwtAuthGuard();
    const ok = await guard.canActivate(
      makeHttpContext({ headers: { authorization: 'Bearer abc' } })
    );
    expect(ok).toBe(true);
  });
});
