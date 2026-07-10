import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Returns true if the key has exceeded `max` requests within `windowMs`.
 */
export async function isRateLimited(key: string, max: number, windowMs: number): Promise<boolean> {
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.pexpire(key, windowMs);
  }
  return count > max;
}
