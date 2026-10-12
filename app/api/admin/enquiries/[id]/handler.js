import { NextResponse } from "next/server";
import { prisma as defaultPrisma } from "../../../../../lib/prisma";
import { getAdminSession } from "../../../../../lib/auth/session";
import { enforceSameOrigin } from "../../../../../lib/security/csrf";

export async function handleAdminDeleteEnquiry(
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

  const existing = await prisma.contactEnquiry.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Enquiry not found." },
      { status: 404 }
    );
  }

  await prisma.contactEnquiry.delete({
    where: { id },
  });

  return NextResponse.json({
    success: true,
    message: "Enquiry deleted successfully.",
  });
}
