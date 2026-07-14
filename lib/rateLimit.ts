import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

/**
 * Returns true if the key has exceeded `max` requests within `windowMs`.
 * Falls back to no rate limiting when Redis is not configured.
 */
export async function isRateLimited(key: string, max: number, windowMs: number): Promise<boolean> {
  if (!redis) return false;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.pexpire(key, windowMs);
  }
  return count > max;
}
