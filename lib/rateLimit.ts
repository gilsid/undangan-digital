import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

// ── In-memory fallback when Redis is not available ──
const memoryStore = new Map<string, { count: number; resetAt: number }>();
const MEMORY_CLEAN_INTERVAL = 60_000; // sweep stale entries every 60s
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryStore) {
    if (entry.resetAt <= now) memoryStore.delete(key);
  }
}, MEMORY_CLEAN_INTERVAL).unref?.();

/**
 * Returns true if the key has exceeded `max` requests within `windowMs`.
 * Falls back to in-memory Map when Redis is not configured.
 * In-memory is per-process — accurate only in single-instance deployments.
 */
export async function isRateLimited(key: string, max: number, windowMs: number): Promise<boolean> {
  if (redis) {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.pexpire(key, windowMs);
    }
    return count > max;
  }

  // In-memory fallback
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || entry.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}
