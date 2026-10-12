/**
 * StaffSpectrum Login Rate Limiter & Brute-Force Throttle
 *
 * ARCHITECTURAL LIMITATION & OPERATIONAL CONSTRAINTS:
 * This implementation maintains a sliding-window tracker using an in-memory Map.
 * - Single-process constraint: Memory is local to the current Node.js process. In multi-instance,
 *   clustered, or multi-container deployments, state is not shared across processes.
 *   For multi-instance horizontal scaling, a distributed store (e.g. Redis) is required.
 * - Trusted reverse proxy constraint: getClientIp() relies on the leftmost X-Forwarded-For value.
 *   The edge reverse proxy (such as Cloudflare or Nginx) MUST be configured to overwrite or strip
 *   untrusted incoming client X-Forwarded-For headers to prevent IP spoofing.
 */

const failedAttempts = new Map();

const WINDOW_MS = 15 * 60 * 1000; // 15-minute sliding window
const MAX_FAILURES = 5; // 5 failed attempts triggers lockout

function checkKeyThrottle(key) {
  if (!key) return { allowed: true, remaining: MAX_FAILURES };

  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const entry = failedAttempts.get(key);
  if (!entry) {
    return { allowed: true, remaining: MAX_FAILURES };
  }

  // Filter out attempts older than current sliding window
  const activeAttempts = entry.filter((time) => time > windowStart);
  failedAttempts.set(key, activeAttempts);

  if (activeAttempts.length >= MAX_FAILURES) {
    const oldest = activeAttempts[0];
    const retryAfterSeconds = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      retryAfter: Math.max(retryAfterSeconds, 1),
    };
  }

  return {
    allowed: true,
    remaining: MAX_FAILURES - activeAttempts.length,
  };
}

/**
 * Checks login throttling using both client IP and normalized account email.
 * Accepts either an object { clientIp, email } or a legacy string identifier.
 */
export function checkLoginThrottle(target) {
  if (typeof target === "string") {
    const directCheck = checkKeyThrottle(target);
    if (!directCheck.allowed) return directCheck;
    if (!target.startsWith("ip:") && !target.startsWith("acc:")) {
      return checkKeyThrottle(`ip:${target}`);
    }
    return directCheck;
  }

  const { clientIp, email } = target || {};
  const normalizedEmail = (email || "").trim().toLowerCase();

  // 1. Check IP-level throttle (defends against credential stuffing from single IP)
  if (clientIp) {
    const ipPrefixed = checkKeyThrottle(`ip:${clientIp}`);
    if (!ipPrefixed.allowed) return ipPrefixed;
    const ipDirect = checkKeyThrottle(clientIp);
    if (!ipDirect.allowed) return ipDirect;
  }

  // 2. Check Account-level throttle (defends against distributed attacks targeting a specific account)
  if (normalizedEmail) {
    const accountCheck = checkKeyThrottle(`acc:${normalizedEmail}`);
    if (!accountCheck.allowed) {
      return accountCheck;
    }
  }

  return { allowed: true, remaining: MAX_FAILURES };
}

/**
 * Record a failed login attempt for both IP and target account email
 */
export function recordLoginFailure(target) {
  const now = Date.now();

  const recordKey = (key) => {
    if (!key) return;
    const list = failedAttempts.get(key) || [];
    list.push(now);
    failedAttempts.set(key, list);
  };

  if (typeof target === "string") {
    recordKey(target);
    if (!target.startsWith("ip:") && !target.startsWith("acc:")) {
      recordKey(`ip:${target}`);
    }
    return;
  }

  const { clientIp, email } = target || {};
  if (clientIp) {
    recordKey(`ip:${clientIp}`);
    recordKey(clientIp);
  }
  if (email) recordKey(`acc:${email.trim().toLowerCase()}`);
}

/**
 * Reset failed attempts on successful login
 */
export function recordLoginSuccess(target) {
  if (typeof target === "string") {
    failedAttempts.delete(target);
    failedAttempts.delete(`ip:${target}`);
    return;
  }

  const { clientIp, email } = target || {};
  if (clientIp) {
    failedAttempts.delete(`ip:${clientIp}`);
    failedAttempts.delete(clientIp);
  }
  if (email) failedAttempts.delete(`acc:${email.trim().toLowerCase()}`);
}

/**
 * Reset all throttle records (useful for test isolation)
 */
export function resetLoginThrottles() {
  failedAttempts.clear();
}
