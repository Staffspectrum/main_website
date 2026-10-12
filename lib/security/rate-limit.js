import crypto from "crypto";

// Store recent submission timestamps: Map<ipHash, number[]>
const submissionTracker = new Map();

// Configuration
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5; // Max 5 submissions per window per IP
export const MAX_BODY_BYTES = 32 * 1024; // 32 KB payload limit

/**
 * Hash client IP using SHA-256 and an optional salt.
 * Ensures raw IP addresses are never logged or stored.
 */
export function hashClientIp(ip) {
  if (!ip || typeof ip !== "string") {
    return "anonymous";
  }
  const salt = process.env.IP_HASH_SALT || "staffspectrum_default_salt";
  return crypto.createHmac("sha256", salt).update(ip.trim()).digest("hex").slice(0, 32);
}

/**
 * Extract client IP from standard reverse proxy headers
 */
export function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Check rate limit for a given IP hash
 */
export function checkRateLimit(ipHash) {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Retrieve existing timestamps for this IP hash
  let timestamps = submissionTracker.get(ipHash) || [];

  // Filter out timestamps older than current sliding window
  timestamps = timestamps.filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS) {
    const oldest = timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      retryAfter: Math.max(retryAfterSeconds, 1),
    };
  }

  // Record current timestamp
  timestamps.push(now);
  submissionTracker.set(ipHash, timestamps);

  // Periodic pruning of dead records to safeguard 1 GB RAM VPS
  if (submissionTracker.size > 1000) {
    for (const [key, times] of submissionTracker.entries()) {
      const active = times.filter((t) => t > windowStart);
      if (active.length === 0) {
        submissionTracker.delete(key);
      } else {
        submissionTracker.set(key, active);
      }
    }
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS - timestamps.length,
  };
}

/**
 * Helper to reset rate limits (useful for testing)
 */
export function resetRateLimits() {
  submissionTracker.clear();
}
