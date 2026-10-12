import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "staffspectrum_admin_session";
const SESSION_EXPIRY = "8h"; // 8 hours
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || typeof secret !== "string" || secret.trim() === "") {
    throw new Error(
      "ADMIN_JWT_SECRET environment variable is required. Configure a secure secret of at least 32 characters."
    );
  }
  if (secret.length < 32) {
    throw new Error(
      "ADMIN_JWT_SECRET is insufficiently secure. It must be at least 32 characters long (256 bits) for HS256."
    );
  }
  return secret;
}

function getEncodedKey() {
  return new TextEncoder().encode(getJwtSecret());
}

/**
 * Creates a signed JWT session token
 */
export async function createSessionToken(user) {
  const key = getEncodedKey();

  return await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role || "ADMIN",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .sign(key);
}

/**
 * Verifies and decodes a session token. Returns null if invalid or expired.
 */
export async function verifySessionToken(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    const key = getEncodedKey();
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

/**
 * Standard cookie configuration for secure HTTP-only sessions
 */
export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/**
 * Extracts and verifies session from request cookies or Authorization header
 */
export async function getAdminSession(request) {
  if (!request) return null;

  // 1. Try reading from Next.js request.cookies if available
  let token = null;
  if (request.cookies && typeof request.cookies.get === "function") {
    const cookie = request.cookies.get(SESSION_COOKIE_NAME);
    token = cookie ? cookie.value : null;
  }

  // 2. Fallback to parsing raw Cookie header
  if (!token && request.headers && typeof request.headers.get === "function") {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader.match(
        new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]*)`)
      );
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }

    // 3. Optional Bearer token support for API consumers
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7).trim();
      }
    }
  }

  if (!token) return null;

  return await verifySessionToken(token);
}
