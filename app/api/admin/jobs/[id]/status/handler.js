import { NextResponse } from "next/server";
import { prisma as defaultPrisma } from "../../../../../../lib/prisma";
import { getAdminSession } from "../../../../../../lib/auth/session";
import { enforceSameOrigin } from "../../../../../../lib/security/csrf";

const VALID_STATUSES = ["DRAFT", "PUBLISHED", "CLOSED"];

export async function handleAdminUpdateJobStatus(
  request,
  paramsPromise,
  {
    prisma = defaultPrisma,
    sessionVerifier = getAdminSession,
    csrfGuard = enforceSameOrigin,
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

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { status } = body || {};

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid status. Allowed values are DRAFT, PUBLISHED, or CLOSED.",
      },
      { status: 400 }
    );
  }

  const existing = await prisma.job.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Job opening not found." },
      { status: 404 }
    );
  }

  const updatedJob = await prisma.job.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({
    success: true,
    message: `Job status updated to ${status}.`,
    job: updatedJob,
  });
}
