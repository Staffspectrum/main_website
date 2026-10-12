import { NextResponse } from "next/server";
import { prisma as defaultPrisma } from "../../../../../lib/prisma";
import { getAdminSession } from "../../../../../lib/auth/session";
import { enforceSameOrigin } from "../../../../../lib/security/csrf";
import { deleteResumeFromR2 as defaultDeleteResumeFromR2 } from "../../../../../lib/storage/r2";

export async function handleAdminGetApplicationById(
  request,
  paramsPromise,
  { prisma = defaultPrisma, sessionVerifier = getAdminSession } = {}
) {
  const session = await sessionVerifier(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }

  const { id } = await paramsPromise;
  const application = await prisma.jobApplication.findUnique({
    where: { id },
    include: {
      job: true,
    },
  });

  if (!application) {
    return NextResponse.json(
      { success: false, error: "Application not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, application });
}

export async function handleAdminDeleteApplication(
  request,
  paramsPromise,
  {
    prisma = defaultPrisma,
    sessionVerifier = getAdminSession,
    csrfGuard = enforceSameOrigin,
    r2Deleter = defaultDeleteResumeFromR2,
  } = {}
) {
  if (csrfGuard) {
    const csrfError = csrfGuard(request);
    if (csrfError) return csrfError;
  }

  const session = await sessionVerifier(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }

  const { id } = await paramsPromise;

  const existing = await prisma.jobApplication.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Application not found." },
      { status: 404 }
    );
  }

  // 1. Delete corresponding resume from Cloudflare R2
  if (existing.r2ObjectKey && r2Deleter) {
    try {
      await r2Deleter(existing.r2ObjectKey);
    } catch (r2Error) {
      console.error(
        `[Admin] Failed to delete R2 resume object "${existing.r2ObjectKey}":`,
        r2Error?.message
      );
    }
  }

  // 2. Delete job application record from database
  await prisma.jobApplication.delete({
    where: { id },
  });

  return NextResponse.json({
    success: true,
    message: "Application and corresponding resume deleted successfully.",
  });
}
