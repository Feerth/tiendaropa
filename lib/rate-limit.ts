import { kv } from "@vercel/kv";

const memoryStore = new Map<string, { count: number; resetAt: number }>();

function getMemory(key: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetIn: entry.resetAt - now };
}

function kvAvailable(): boolean {
  return !!(process.env.KV_URL || process.env.KV_REST_API_URL);
}

function windowKey(name: string, ip: string, windowMs: number): string {
  const slot = Math.floor(Date.now() / windowMs);
  return `ratelimit:${name}:${ip}:${slot}`;
}

export async function rateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 10 * 60 * 1000
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  if (!kvAvailable()) {
    return getMemory(key, maxRequests, windowMs);
  }

  const rk = windowKey(key, key, windowMs);
  const windowSeconds = Math.ceil(windowMs / 1000);

  try {
    const count = await kv.incr(rk);
    if (count === 1) {
      await kv.expire(rk, windowSeconds);
    }
    const ttl = await kv.ttl(rk);

    return {
      allowed: count <= maxRequests,
      remaining: Math.max(0, maxRequests - count),
      resetIn: ttl > 0 ? ttl * 1000 : 0,
    };
  } catch {
    return getMemory(key, maxRequests, windowMs);
  }
}

export async function checkRateLimit(
  name: string,
  ip: string,
  maxRequests: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  if (!kvAvailable()) {
    return getMemory(`${name}:${ip}`, maxRequests, windowMs);
  }

  const rk = windowKey(name, ip, windowMs);
  const windowSeconds = Math.ceil(windowMs / 1000);

  try {
    const count = await kv.incr(rk);
    if (count === 1) {
      await kv.expire(rk, windowSeconds);
    }
    const ttl = await kv.ttl(rk);

    return {
      allowed: count <= maxRequests,
      remaining: Math.max(0, maxRequests - count),
      resetIn: ttl > 0 ? ttl * 1000 : 0,
    };
  } catch {
    return getMemory(`${name}:${ip}`, maxRequests, windowMs);
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "127.0.0.1";
}
