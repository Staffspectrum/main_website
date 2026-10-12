import { NextResponse } from "next/server";
import { prisma as defaultPrisma } from "../../../../../../lib/prisma";
import { getAdminSession } from "../../../../../../lib/auth/session";
import { getResumeStreamFromR2 } from "../../../../../../lib/storage/r2";
import { verifyResumeDownloadToken } from "../../../../../../lib/security/resume-token";

export async function handleAdminGetResume(
  request,
  paramsPromise,
  {
    prisma = defaultPrisma,
    sessionVerifier = getAdminSession,
    streamGetter = getResumeStreamFromR2,
    tokenVerifier = verifyResumeDownloadToken,
  } = {}
) {
  const { id } = await paramsPromise;

  // 1. Strict Server-side Authorization Verification:
  // Allows either active Admin session OR a valid cryptographically signed download token
  const session = await sessionVerifier(request);
  let isAuthorized = !!session;

  if (!isAuthorized) {
    let token = null;
    try {
      if (request?.url) {
        const url = new URL(request.url, "https://example.com");
        token = url.searchParams.get("token");
      }
    } catch {
      // In case request.url cannot be parsed as a URL
    }

    if (token) {
      const verifiedPayload = await tokenVerifier(token, id);
      if (verifiedPayload) {
        isAuthorized = true;
      }
    }
  }

  if (!isAuthorized) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized. Active admin session or valid secure download link required to access candidate resumes.",
      },
      { status: 401 }
    );
  }

  // 2. Fetch Application Record from PostgreSQL
  let application;
  try {
    application = await prisma.jobApplication.findUnique({
      where: { id },
    });
  } catch (err) {
    console.error("[Admin Resume Download] Database error:", err?.message);
    return NextResponse.json(
      { success: false, error: "Database error retrieving application." },
      { status: 500 }
    );
  }

  if (!application) {
    return NextResponse.json(
      { success: false, error: "Application record not found." },
      { status: 404 }
    );
  }

  if (!application.r2ObjectKey) {
    return NextResponse.json(
      { success: false, error: "No CV document attached to this application." },
      { status: 404 }
    );
  }

  // 3. Retrieve Object Stream from Private Cloudflare R2
  try {
    const { body, contentType } = await streamGetter(application.r2ObjectKey);

    const safeFileName = (application.originalFileName || "resume.pdf")
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    // Return streamed file with strict security headers
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType || "application/pdf",
        "Content-Disposition": `inline; filename="${safeFileName}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (storageError) {
    console.error("[Admin Resume Download] Storage error:", storageError?.message);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to retrieve document from storage at this time.",
      },
      { status: 500 }
    );
  }
}
