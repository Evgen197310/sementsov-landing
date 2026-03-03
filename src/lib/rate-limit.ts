const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (entry.resetAt < now) rateLimitMap.delete(key);
  }
}, 60_000);

/**
 * Simple in-memory rate limiter.
 * Returns { ok: true } if under limit, { ok: false, retryAfter } if exceeded.
 */
export function rateLimit(
  key: string,
  { maxRequests = 10, windowMs = 60_000 } = {}
): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  return { ok: true };
}
