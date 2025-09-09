import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infra/db/prisma/prisma.service';
import type { IUrlsRepository } from '../../domain/repositories/urls.repository';
import type { Url } from '@prisma/client';
import { CreateUrlInput } from '../../domain/types/url-types';

@Injectable()
export class UrlsPrismaRepository implements IUrlsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateUrlInput): Promise<Url> {
    return this.prisma.url.create({ data });
  }

  findByShortCode(shortCode: string): Promise<Url | null> {
    return this.prisma.url.findFirst({
      where: { shortCode, deletedAt: null }
    });
  }

  async isShortCodeTaken(shortCode: string): Promise<boolean> {
    const found = await this.prisma.url.findUnique({ where: { shortCode } });
    return !!found;
  }

  async recordClick(
    urlId: string,
    meta?: { ip?: string; userAgent?: string }
  ): Promise<void> {
    await this.prisma.click.create({
      data: {
        urlId,
        ip: meta?.ip ?? null,
        userAgent: meta?.userAgent ?? null
      }
    });
  }

  async listByOwner(
    ownerId: string
  ): Promise<
    Array<{
      id: string
      shortCode: string
      originalUrl: string
      clicks: number
      createdAt: Date
      updatedAt: Date
    }>
  > {
    const rows = await this.prisma.url.findMany({
      where: { userId: ownerId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        shortCode: true,
        originalUrl: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { clicks: true } }
      }
    });

    return rows.map(r => ({
      id: r.id,
      shortCode: r.shortCode,
      originalUrl: r.originalUrl,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      clicks: r._count.clicks
    }));
  }

  async updateDestinationIfOwner(id: string, ownerId: string, destination: string): Promise<boolean> {
    const res = await this.prisma.url.updateMany({
      where: { id, userId: ownerId, deletedAt: null },
      data: { originalUrl: destination }
    });
    return res.count > 0;
  }

  async findByIdAndOwner(id: string, ownerId: string) {
    const row = await this.prisma.url.findFirst({
      where: { id, userId: ownerId, deletedAt: null },
      select: {
        id: true,
        shortCode: true,
        originalUrl: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { clicks: true } }
      }
    });
    return row
      ? {
        id: row.id,
        shortCode: row.shortCode,
        originalUrl: row.originalUrl,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        clicks: row._count.clicks
      }
      : null;
  }

  async softDeleteIfOwner(id: string, ownerId: string): Promise<boolean> {
    const res = await this.prisma.url.updateMany({
      where: { id, userId: ownerId, deletedAt: null },
      data: { deletedAt: new Date() }
    });
    return res.count > 0;
  }

}
