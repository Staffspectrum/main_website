import { NextResponse } from "next/server";

/**
 * Verifies that a state-changing request (POST, PUT, PATCH, DELETE) originates
 * from the same origin as the application, protecting against Cross-Site Request Forgery (CSRF).
 *
 * Rules:
 * 1. Safe HTTP methods (GET, HEAD, OPTIONS) are permitted without origin checks.
 * 2. Origin header is preferred; falls back to Referer if Origin is omitted.
 * 3. Parsed strictly via the standard URL API to compare hostnames and ports.
 *    Does NOT use substring matching.
 * 4. Checks Sec-Fetch-Site header: immediately rejects if set to "cross-site".
 * 5. Compares source host with the target Host (or trusted X-Forwarded-Host).
 *
 * Trusted Proxy Assumption:
 * The edge reverse proxy (e.g., Nginx on VPS or Cloudflare) must forward the genuine
 * Host header or populate X-Forwarded-Host accurately.
 */
const DEV_TUNNEL_SUFFIXES = [
  ".devtunnels.ms",
  ".visualstudio.com",
  ".github.dev",
  ".gitpod.io",
  ".ngrok-free.app",
  ".ngrok.io",
  ".loca.lt",
  ".trycloudflare.com",
];

function normalizeHost(h) {
  if (!h) return "";
  return h.split(",")[0].trim().toLowerCase().replace(/:(80|443)$/, "");
}

function isLocalOrPrivateHost(host) {
  if (!host) return false;
  const hostname = host.split(":")[0];
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
  );
}

function isTunnelHost(hostname) {
  if (!hostname) return false;
  const lower = hostname.toLowerCase();
  return DEV_TUNNEL_SUFFIXES.some((suffix) => lower.endsWith(suffix));
}

export function verifySameOrigin(request) {
  if (!request) {
    return { allowed: false, reason: "Missing request context." };
  }

  const method = (request.method || "GET").toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return { allowed: true };
  }

  // 1. Check modern browser Sec-Fetch-Site header if available
  const secFetchSite = request.headers?.get?.("sec-fetch-site")?.toLowerCase();
  if (secFetchSite === "cross-site") {
    return { allowed: false, reason: "Cross-site request blocked by browser fetch metadata." };
  }

  // 2. Extract source origin
  const originHeader = request.headers?.get?.("origin");
  const refererHeader = request.headers?.get?.("referer");
  const candidateUrl = originHeader || refererHeader;

  if (!candidateUrl) {
    return { allowed: false, reason: "State-changing request missing Origin and Referer headers." };
  }

  let parsedSource;
  try {
    parsedSource = new URL(candidateUrl);
  } catch {
    return { allowed: false, reason: "Malformed Origin or Referer header URL." };
  }

  // 3. Extract target host
  const forwardedHost = request.headers?.get?.("x-forwarded-host");
  const originalHost = request.headers?.get?.("x-original-host");
  const hostHeader = request.headers?.get?.("host");
  const targetHost = normalizeHost(forwardedHost || originalHost || hostHeader);

  if (!targetHost) {
    return { allowed: false, reason: "Missing Host header on incoming request." };
  }

  const sourceHost = normalizeHost(parsedSource.host);
  const sourceHostname = parsedSource.hostname.toLowerCase();

  // Exact host match (same hostname and port)
  if (sourceHost === targetHost) {
    return { allowed: true };
  }

  // 4. Permit trusted development tunnels and local/LAN environments
  const isTargetLocal = isLocalOrPrivateHost(targetHost);
  const isSourceLocal = isLocalOrPrivateHost(sourceHost);
  const isSourceTunnel = isTunnelHost(sourceHostname);

  const customAllowedOrigins = (process.env.DEV_ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (
    (isTargetLocal && (isSourceTunnel || isSourceLocal)) ||
    (process.env.NODE_ENV !== "production" && (isSourceTunnel || isSourceLocal)) ||
    customAllowedOrigins.includes(sourceHost)
  ) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Origin mismatch: source host "${sourceHost}" does not match target "${targetHost}".`,
  };
}

/**
 * Convenience helper to return standard 403 Forbidden response on CSRF failure
 */
export function enforceSameOrigin(request) {
  const result = verifySameOrigin(request);
  if (!result.allowed) {
    console.warn(`[CSRF Blocked] ${result.reason} | Origin: ${request.headers?.get?.("origin")} | Host: ${request.headers?.get?.("host")} | X-Forwarded-Host: ${request.headers?.get?.("x-forwarded-host")}`);
    return NextResponse.json(
      {
        success: false,
        error: "Forbidden. Cross-site state modification rejected.",
        details: result.reason,
      },
      { status: 403 }
    );
  }
  return null; // Allowed
}
