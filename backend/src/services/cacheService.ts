import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

let redisClient: RedisClientType | null = null;

/**
 * Initialize Redis client connection
 */
export const initRedisClient = async (): Promise<void> => {
  try {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    
    logger.info(`Connecting to Redis at ${redisHost}:${redisPort}`);
    
    redisClient = createClient({
      url: `redis://${redisHost}:${redisPort}`,
    });
    
    redisClient.on('error', (err) => {
      logger.error('Redis client error:', err);
    });
    
    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });
    
    redisClient.on('reconnecting', () => {
      logger.info('Redis client reconnecting');
    });
    
    await redisClient.connect();
  } catch (error) {
    logger.error('Failed to initialize Redis client:', error);
    throw error;
  }
};

/**
 * Disconnect Redis client
 */
export const disconnectRedis = async (): Promise<void> => {
  try {
    if (redisClient?.isOpen) {
      await redisClient.disconnect();
      logger.info('Redis client disconnected');
    }
  } catch (error) {
    logger.error('Error disconnecting Redis:', error);
  }
};

/**
 * Set value in Redis cache
 */
export const setCache = async (key: string, value: any, expiryInSeconds: number = 3600): Promise<void> => {
  try {
    if (!redisClient?.isOpen) {
      logger.warn('Redis client not connected when attempting to set cache');
      return;
    }
    
    await redisClient.setEx(key, expiryInSeconds, JSON.stringify(value));
    logger.debug(`Cache set for key: ${key}`);
  } catch (error) {
    logger.error(`Error setting cache for key ${key}:`, error);
  }
};

/**
 * Get value from Redis cache
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    if (!redisClient?.isOpen) {
      logger.warn('Redis client not connected when attempting to get cache');
      return null;
    }
    
    logger.debug(`Attempting to get cache for key: ${key}`);
    const data = await redisClient.get(key);
    
    if (!data) {
      logger.debug(`Cache miss for key: ${key}`);
      return null;
    }
    
    logger.debug(`Cache hit for key: ${key}`);
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
};

/**
 * Delete value from Redis cache
 */
export const deleteCache = async (key: string): Promise<void> => {
  try {
    if (!redisClient?.isOpen) {
      logger.warn('Redis client not connected when attempting to delete cache');
      return;
    }
    
    await redisClient.del(key);
    logger.debug(`Cache deleted for key: ${key}`);
  } catch (error) {
    logger.error(`Error deleting cache for key ${key}:`, error);
  }
};
