import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AnonymousUrlCache } from '../../infrastructure/cache/anon-url.cache';
import { UrlsService } from '../../application/urls.service';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('redirect')
@Controller()
export class RedirectController {
  constructor(
    private readonly anonCache: AnonymousUrlCache,
    private readonly urls: UrlsService
  ) {}

  @Get(':code')
  @ApiOperation({
    summary: 'Redirecionar um código encurtado para a URL original',
    description:
      'Recebe o código encurtado e redireciona o cliente para a URL de destino. ' +
      'Se for de usuário autenticado, contabiliza o clique.'
  })
  @ApiParam({
    name: 'code',
    description: 'Código encurtado até 6 caracteres alfanuméricos',
    example: 'aZbKq7'
  })
  @ApiResponse({
    status: 302,
    description: 'Redireciona para a URL de destino'
  })
  @ApiResponse({
    status: 404,
    description: 'Short link não encontrado',
    schema: {
      example: { message: 'Short link not found' }
    }
  })
  async redirect(
    @Param('code') code: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    if (!/^[0-9A-Za-z]{1,6}$/.test(code)) {
      res.status(404).json({ message: 'Short link not found' });
      return;
    }

    const anon = await this.anonCache.get(code);
    if (anon) {
      res.redirect(302, anon);
      return;
    }

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      undefined;
    const userAgent = req.headers['user-agent'] as string | undefined;

    try {
      const destination = await this.urls.resolveAndRecord(code, {
        ip,
        userAgent
      });
      res.redirect(302, destination);
      return;
    } catch {
      res.status(404).json({ message: 'Short link not found' });
      return;
    }
  }
}
