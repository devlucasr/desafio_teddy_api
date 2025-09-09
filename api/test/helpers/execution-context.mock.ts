import { ExecutionContext } from '@nestjs/common';
import type { Request, Response } from 'express';

export function makeHttpContext(req: Record<string, unknown> = {}): ExecutionContext {
  const request = req as unknown as Request;
  const response = {} as unknown as Response;

  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
      getNext: () => undefined
    })
  } as unknown as ExecutionContext;
}
