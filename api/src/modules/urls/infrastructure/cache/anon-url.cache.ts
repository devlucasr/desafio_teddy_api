import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../../infra/cache/redis/redis.service';

const PREFIX = 'anon:url:';

@Injectable()
export class AnonymousUrlCache {
  private ttl = Number(process.env.ANON_URL_TTL_SECONDS || 86400);

  constructor(private readonly redis: RedisService) {}

  async set(code: string, destination: string): Promise<void> {
    const key = PREFIX + code;
    await this.redis.getClient().set(key, destination, 'EX', this.ttl);
  }

  async get(code: string): Promise<string | null> {
    const key = PREFIX + code;
    const val = await this.redis.getClient().get(key);
    return val;
  }

  async exists(code: string): Promise<boolean> {
    const key = PREFIX + code;
    const n = await this.redis.getClient().exists(key);
    return n === 1;
  }
}
