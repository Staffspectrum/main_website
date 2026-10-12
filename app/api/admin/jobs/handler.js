import { NextResponse } from "next/server";
import { prisma as defaultPrisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/auth/session";
import { jobSchema } from "../../../../lib/validations/job";
import { enforceSameOrigin } from "../../../../lib/security/csrf";

export async function handleAdminGetJobs(
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
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error("[Admin GET Jobs Error]:", err?.message);
    return NextResponse.json(
      { success: false, error: "Unable to retrieve job listings." },
      { status: 500 }
    );
  }
}

export async function handleAdminCreateJob(
  request,
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

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const validation = jobSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed.",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const jobData = validation.data;

    // Verify slug uniqueness
    const existing = await prisma.job.findUnique({
      where: { linkSlug: jobData.linkSlug },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `A job opening with slug "${jobData.linkSlug}" already exists.`,
          details: { linkSlug: ["Slug is already in use."] },
        },
        { status: 409 }
      );
    }

    const createdJob = await prisma.job.create({
      data: jobData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Job opening created successfully.",
        job: createdJob,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Admin Create Job Error]:", err?.message);
    return NextResponse.json(
      { success: false, error: "Failed to create job opening." },
      { status: 500 }
    );
  }
}
