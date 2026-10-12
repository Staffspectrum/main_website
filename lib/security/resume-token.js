import { SignJWT, jwtVerify } from "jose";

const TOKEN_EXPIRY = "7d"; // 7 days expiration for HR download link

function getSecretKey() {
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
  return new TextEncoder().encode(secret);
}

/**
 * Creates a cryptographically signed token specifically for secure CV download.
 * Payload includes the applicationId and scope to prevent token reuse across endpoints.
 */
export async function createResumeDownloadToken({
  applicationId,
  r2ObjectKey = "",
  expiresIn = TOKEN_EXPIRY,
}) {
  if (!applicationId) {
    throw new Error("applicationId is required to generate download token.");
  }

  const key = getSecretKey();
  return await new SignJWT({
    sub: applicationId,
    r2Key: r2ObjectKey,
    scope: "cv_download",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

/**
 * Verifies the download token and checks that it matches the requested applicationId.
 * Returns payload if valid, null otherwise.
 */
export async function verifyResumeDownloadToken(token, expectedApplicationId) {
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    if (payload.scope !== "cv_download") {
      return null;
    }

    if (expectedApplicationId && payload.sub !== expectedApplicationId) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
