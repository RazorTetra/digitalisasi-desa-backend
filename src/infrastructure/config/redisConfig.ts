// src/infrastructure/config/redisConfig.ts

import Redis from 'ioredis';

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  username?: string;
  tls?: boolean;
}

class RedisClient {
  private static instance: Redis | null = null;
  private static config: RedisConfig;

  private constructor() {}

  public static initialize(config: RedisConfig): void {
    this.config = config;
  }

  public static getInstance(): Redis | null {
    // Jika Redis tidak dikonfigurasi, return null
    if (!this.config) {
      console.warn('Redis configuration not found. Running without Redis cache.');
      return null;
    }

    if (!this.instance) {
      try {
        this.instance = new Redis({
          host: this.config.host,
          port: this.config.port,
          password: this.config.password,
          username: this.config.username,
          tls: this.config.tls ? {} : undefined,
          retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
          maxRetriesPerRequest: 3,
        });

        this.instance.on('error', (error: Error) => {
          console.error('Redis connection error:', error);
        });

        this.instance.on('connect', () => {
          console.log('Successfully connected to Redis');
        });

      } catch (error) {
        console.error('Failed to create Redis instance:', error);
        return null;
      }
    }

    return this.instance;
  }

  public static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.quit();
      this.instance = null;
    }
  }
}

export class RedisService {
  private redis: Redis | null;
  private defaultTTL: number = 3600; // 1 hour in seconds
  private isRedisAvailable: boolean;

  constructor() {
    this.redis = RedisClient.getInstance();
    this.isRedisAvailable = this.redis !== null;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isRedisAvailable) return null;

    try {
      const value = await this.redis!.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting key ${key} from Redis:`, error);
      return null;
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<boolean> {
    if (!this.isRedisAvailable) return false;

    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await this.redis!.setex(key, ttl, stringValue);
      } else {
        await this.redis!.setex(key, this.defaultTTL, stringValue);
      }
      return true;
    } catch (error) {
      console.error(`Error setting key ${key} in Redis:`, error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.isRedisAvailable) return false;

    try {
      await this.redis!.del(key);
      return true;
    } catch (error) {
      console.error(`Error deleting key ${key} from Redis:`, error);
      return false;
    }
  }

  async clearCache(): Promise<boolean> {
    if (!this.isRedisAvailable) return false;

    try {
      await this.redis!.flushall();
      return true;
    } catch (error) {
      console.error('Error clearing Redis cache:', error);
      return false;
    }
  }
}

// Initialize Redis with configuration from environment variables
export const initializeRedis = (): void => {
  // Check if Redis is enabled
  const isRedisEnabled = process.env.REDIS_ENABLED === 'true';

  if (!isRedisEnabled) {
    console.log('Redis is disabled. Running without cache.');
    return;
  }

  const config: RedisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
    tls: process.env.REDIS_TLS === 'true',
  };

  RedisClient.initialize(config);
};

// Singleton instance
let redisServiceInstance: RedisService | null = null;

export const getRedisService = (): RedisService => {
  if (!redisServiceInstance) {
    redisServiceInstance = new RedisService();
  }
  return redisServiceInstance;
};