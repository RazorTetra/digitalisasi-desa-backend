// src/infrastructure/config/redisConfig.ts

import { createClient, RedisClientType } from 'redis';

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  username?: string;
}

class RedisClient {
  private static instance: RedisClientType | null = null;
  private static config: RedisConfig | null = null;

  private constructor() {}

  public static initialize(config: RedisConfig): void {
    this.config = config;
    this.createInstance();
  }

  private static async createInstance(): Promise<void> {
    if (!this.config) {
      console.warn('Redis configuration not found. Running without Redis cache.');
      return;
    }

    try {
      this.instance = createClient({
        password: this.config.password,
        socket: {
          host: this.config.host,
          port: this.config.port
        }
      });

      // Event listeners
      this.instance.on('error', (error: Error) => {
        console.error('Redis connection error:', error);
      });

      this.instance.on('connect', () => {
        console.log('Successfully connected to Redis');
      });

      this.instance.on('ready', () => {
        console.log('Redis client ready');
      });

      this.instance.on('reconnecting', () => {
        console.log('Redis client reconnecting');
      });

      // Connect to Redis
      await this.instance.connect();

    } catch (error) {
      console.error('Failed to create Redis instance:', error);
      this.instance = null;
    }
  }

  public static getInstance(): RedisClientType | null {
    return this.instance;
  }

  public static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.disconnect();
      this.instance = null;
    }
  }
}

export class RedisService {
  private redis: RedisClientType | null;
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
        await this.redis!.setEx(key, ttl, stringValue);
      } else {
        await this.redis!.setEx(key, this.defaultTTL, stringValue);
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
      await this.redis!.flushAll();
      return true;
    } catch (error) {
      console.error('Error clearing Redis cache:', error);
      return false;
    }
  }
}

export const initializeRedis = (): void => {
  const isRedisEnabled = process.env.REDIS_ENABLED === 'true';
  
  console.log('Redis Configuration:', {
    enabled: isRedisEnabled,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME
  });

  if (!isRedisEnabled) {
    console.log('Redis is disabled. Running without cache.');
    return;
  }

  const config: RedisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME
  };

  RedisClient.initialize(config);
};

let redisServiceInstance: RedisService | null = null;

export const getRedisService = (): RedisService => {
  if (!redisServiceInstance) {
    redisServiceInstance = new RedisService();
  }
  return redisServiceInstance;
};