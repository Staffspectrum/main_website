import { NextResponse } from "next/server";
import { prisma as defaultPrisma } from "../../../../../../lib/prisma";
import { getAdminSession } from "../../../../../../lib/auth/session";
import { enforceSameOrigin } from "../../../../../../lib/security/csrf";

const VALID_APP_STATUSES = ["NEW", "REVIEWED", "SHORTLISTED", "REJECTED"];

export async function handleAdminUpdateApplicationStatus(
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

  if (!status || !VALID_APP_STATUSES.includes(status)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid status. Allowed values are NEW, REVIEWED, SHORTLISTED, or REJECTED.",
      },
      { status: 400 }
    );
  }

  const existing = await prisma.jobApplication.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Application not found." },
      { status: 404 }
    );
  }

  const updated = await prisma.jobApplication.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({
    success: true,
    message: `Application status updated to ${status}.`,
    application: updated,
  });
}
