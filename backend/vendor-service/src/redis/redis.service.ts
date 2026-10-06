import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client?: Redis;

  constructor() {
    if (process.env.REDIS_URL)
      this.client = new Redis(process.env.REDIS_URL, {
        lazyConnect: true,
        enableOfflineQueue: false, 
      });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    try {
      const value = await this.client.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      this.logger.warn(`Redis read failed: ${String(error)}`);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch (error) {
      this.logger.warn(`Redis write failed: ${String(error)}`);
    }
  }

  async del(key: string): Promise<void> {
    if (this.client) await this.client.del(key);
  }
  async onModuleDestroy() {
    if (this.client) await this.client.quit();
  }
}
