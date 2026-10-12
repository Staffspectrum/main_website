import { NextResponse } from "next/server";
import { prisma as defaultPrisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/auth/session";

export async function handleAdminGetApplications(
  request,
  { prisma = defaultPrisma, sessionVerifier = getAdminSession } = {}
) {
  const session = await sessionVerifier(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");

    const where = {};
    if (jobId) where.jobId = jobId;
    if (status) where.status = status;

    const applications = await prisma.jobApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            linkSlug: true,
            department: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    console.error("[Admin GET Applications Error]:", err?.message);
    return NextResponse.json(
      { success: false, error: "Unable to retrieve job applications." },
      { status: 500 }
    );
  }
}
