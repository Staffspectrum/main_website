import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";

let cachedR2Client = null;

export function getR2Client() {
  if (cachedR2Client) return cachedR2Client;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    return null;
  }

  const endpoint =
    process.env.R2_ENDPOINT ||
    (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : null);

  if (!endpoint) {
    return null;
  }

  cachedR2Client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return cachedR2Client;
}

/**
 * Upload a resume buffer to private Cloudflare R2 bucket.
 * Generates an unpredictable UUID-based object key.
 */
export async function uploadResumeToR2({
  buffer,
  originalFileName,
  mimeType = "application/pdf",
  client = null,
}) {
  const s3 = client || getR2Client();

  if (!s3) {
    throw new Error("Cloudflare R2 storage is not configured in server environment.");
  }

  const bucketName = process.env.R2_BUCKET_NAME || "staffspectrum-resumes-private";
  // Unpredictable UUID key (never use user-supplied filename in key)
  const objectKey = `resumes/${crypto.randomUUID()}.pdf`;

  // Sanitize original filename for safe metadata storage
  const sanitizedFileName = (originalFileName || "resume.pdf")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 100);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: buffer,
    ContentType: mimeType,
    Metadata: {
      "original-filename": encodeURIComponent(sanitizedFileName),
    },
  });

  await s3.send(command);

  return {
    r2ObjectKey: objectKey,
    originalFileName: sanitizedFileName,
    sizeBytes: buffer.length,
    mimeType,
  };
}

/**
 * Retrieve a private resume stream from Cloudflare R2.
 * Used exclusively by the authenticated admin download endpoint.
 */
export async function getResumeStreamFromR2(objectKey, client = null) {
  if (!objectKey) {
    throw new Error("Object key is required.");
  }

  const s3 = client || getR2Client();
  if (!s3) {
    throw new Error("Cloudflare R2 storage is not configured.");
  }

  const bucketName = process.env.R2_BUCKET_NAME || "staffspectrum-resumes-private";
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  const response = await s3.send(command);
  return {
    body: response.Body,
    contentType: response.ContentType || "application/pdf",
    contentLength: response.ContentLength,
  };
}

/**
 * Delete an uploaded resume from Cloudflare R2.
 * Used for transactional rollback if a database write fails.
 */
export async function deleteResumeFromR2(objectKey, client = null) {
  if (!objectKey) return;
  const s3 = client || getR2Client();
  if (!s3) return;

  const bucketName = process.env.R2_BUCKET_NAME || "staffspectrum-resumes-private";

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    await s3.send(command);
  } catch (err) {
    console.error(`[R2 Storage] Failed to delete orphaned object "${objectKey}":`, err?.message);
  }
}
