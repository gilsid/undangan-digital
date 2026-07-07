// ponytail: IN-MEMORY rate limiter — resets on server restart, not shared across instances.
// Upgrade path: replace the store with Redis (ioredis) for multi-instance deployments.

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

/**
 * Returns true if the key has exceeded `max` requests within `windowMs`.
 * Key is typically `${ip}:${route}`.
 */
export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  if (entry.count > max) return true;
  return false;
}
