import { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export type MockRequest = Partial<Request> & {
  headers?: Record<string, string | string[] | undefined>
  user?: unknown
}

export function makeHttpContext(req: MockRequest = {}): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => req
    })
  } as unknown as ExecutionContext;
}
