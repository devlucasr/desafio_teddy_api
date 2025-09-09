import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import type { IUrlsRepository } from '../domain/repositories/urls.repository';
import { URLS_REPOSITORY } from '../domain/repositories/urls.repository';
import { AnonymousUrlCache } from '../infrastructure/cache/anon-url.cache';
import { randomShortCode } from './urls.util';
import type { ClickMeta } from '../domain/types/url-types';

const SHORT_LEN = 6;

@Injectable()
export class UrlsService {
  constructor(
    @Inject(URLS_REPOSITORY) private readonly repo: IUrlsRepository,
    private readonly anonCache: AnonymousUrlCache
  ) {}

  private get appOrigin(): string {
    return (process.env.APP_ORIGIN || 'http://localhost:3000').replace(/\/$/, '');
  }

  private async generateUniqueShortCode(): Promise<string> {
    for (let i = 0; i < 10; i++) {
      const code = randomShortCode(SHORT_LEN);
      const taken = await this.repo.isShortCodeTaken(code);
      if (!taken) return code;
    }
    throw new BadRequestException('Could not generate a unique short code');
  }

  async createShort(destination: string, ownerId?: string | null): Promise<{ id?: string; shortUrl: string }> {
    const dest = destination.trim();
    const shortCode = await this.generateUniqueShortCode();
    const shortUrl = `${this.appOrigin}/${shortCode}`;

    if (ownerId) {
      const created = await this.repo.create({
        shortCode,
        originalUrl: dest,
        userId: ownerId
      });

      return { id: created.id, shortUrl };
    }

    await this.anonCache.set(shortCode, dest);
    return { shortUrl };
  }

  async resolveAndRecord(shortCode: string, meta?: ClickMeta): Promise<string> {
    if (!/^[A-Za-z0-9]{1,6}$/.test(shortCode)) {
      throw new NotFoundException();
    }

    const url = await this.repo.findByShortCode(shortCode);
    if (!url) throw new NotFoundException('Short link not found');

    if (url.userId) {
      await this.repo.recordClick(url.id, { ip: meta?.ip, userAgent: meta?.userAgent });
    }

    return url.originalUrl;
  }

  async getById(id: string, ownerId: string) {
    const url = await this.repo.findByIdAndOwner(id, ownerId);
    if (!url) throw new NotFoundException('URL not found or not owned by user');

    return {
      id: url.id,
      shortCode: url.shortCode,
      shortUrl: `${this.appOrigin}/${url.shortCode}`,
      destination: url.originalUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt
    };
  }

  async listByOwner(ownerId: string) {
    const items = await this.repo.listByOwner(ownerId);
    return items.map(r => ({
      id: r.id,
      shortUrl: `${this.appOrigin}/${r.shortCode}`,
      destination: r.originalUrl,
      clicks: r.clicks,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));
  }

  async updateDestinationAsOwner(input: { id: string; ownerId: string; destination: string }) {
    const dest = input.destination.trim();
    const ok = await this.repo.updateDestinationIfOwner(input.id, input.ownerId, dest);
    if (!ok) throw new NotFoundException('URL not found or not owned by user');
    return { ok: true };
  }

  async removeAsOwner(id: string, ownerId: string) {
    const ok = await this.repo.softDeleteIfOwner(id, ownerId);
    if (!ok) throw new NotFoundException('URL not found or not owned by user');
    return { ok: true };
  }
}
