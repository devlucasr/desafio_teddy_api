import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Post,
  Req,
  UseGuards,
  Delete
} from '@nestjs/common';
import { UrlsService } from '../../application/urls.service';
import { CreateUrlDto } from '../dto/create-url.dto';
import { OptionalJwtAuthGuard } from '../../../../common/guards/optional-jwt.guard';
import type { AuthenticatedRequest } from '../../../../common/interfaces/authenticated-request';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUrlDto } from '../dto/update-url.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('urls')
@Controller('urls')
export class UrlsController {
  constructor(private readonly urls: UrlsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Encurtar uma URL (autenticado ou anônimo)' })
  @ApiBody({ type: CreateUrlDto })
  @ApiResponse({
    status: 201,
    description: 'URL encurtada criada',
    schema: {
      example: {
        id: 'uuid (se autenticado)',
        shortUrl: 'http://localhost:3000/aZbKq7',
        destination: 'https://g1.globo.com'
      }
    }
  })
  async create(@Body() dto: CreateUrlDto, @Req() req: AuthenticatedRequest) {
    const ownerId = req.user?.userId ?? null;
    const data = await this.urls.createShort(dto.destination, ownerId);
    return data;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Buscar uma URL do usuário por ID' })
  @ApiResponse({
    status: 200,
    description: 'URL encontrada',
    schema: {
      example: {
        id: 'uuid',
        shortCode: 'aZbKq7',
        shortUrl: 'http://localhost:3000/aZbKq7',
        destination: 'https://exemplo.com',
        clicks: 0,
        createdAt: '2025-09-07T20:45:12.123Z',
        updatedAt: '2025-09-07T20:47:33.456Z'
      }
    }
  })
  async getOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.urls.getById(id, req.user!.userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Listar todas as URLs do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de URLs do usuário',
    schema: {
      example: {
        items: [
          {
            id: 'uuid',
            shortCode: 'aZbKq7',
            shortUrl: 'http://localhost:3000/aZbKq7',
            destination: 'https://exemplo.com',
            clicks: 0,
            createdAt: '2025-09-07T20:45:12.123Z',
            updatedAt: '2025-09-07T20:47:33.456Z'
          }
        ]
      }
    }
  })
  async listMine(@Req() req: AuthenticatedRequest) {
    const items = await this.urls.listByOwner(req.user!.userId);
    return { items };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Atualizar o destino de uma URL' })
  @ApiBody({ type: UpdateUrlDto })
  @ApiResponse({
    status: 200,
    description: 'URL atualizada com sucesso',
    schema: { example: { ok: true } }
  })
  async updateDestination(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateUrlDto
  ) {
    return this.urls.updateDestinationAsOwner({
      id,
      ownerId: req.user!.userId,
      destination: dto.destination
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Deletar uma URL do usuário' })
  @ApiResponse({
    status: 200,
    description: 'URL deletada com sucesso',
    schema: { example: { ok: true } }
  })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.urls.removeAsOwner(id, req.user!.userId);
  }
}
