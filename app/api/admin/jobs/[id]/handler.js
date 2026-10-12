import { NextResponse } from "next/server";
import { prisma as defaultPrisma } from "../../../../../lib/prisma";
import { getAdminSession } from "../../../../../lib/auth/session";
import { jobSchema } from "../../../../../lib/validations/job";
import { enforceSameOrigin } from "../../../../../lib/security/csrf";

export async function handleAdminGetJobById(
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
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });

  if (!job) {
    return NextResponse.json(
      { success: false, error: "Job opening not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, job });
}

export async function handleAdminUpdateJob(
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

  const existing = await prisma.job.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Job opening not found." },
      { status: 404 }
    );
  }

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

  // Check if slug changed and conflicts with another job
  if (jobData.linkSlug !== existing.linkSlug) {
    const slugConflict = await prisma.job.findUnique({
      where: { linkSlug: jobData.linkSlug },
    });
    if (slugConflict && slugConflict.id !== id) {
      return NextResponse.json(
        {
          success: false,
          error: `Slug "${jobData.linkSlug}" is already in use by another opening.`,
        },
        { status: 409 }
      );
    }
  }

  const updatedJob = await prisma.job.update({
    where: { id },
    data: jobData,
  });

  return NextResponse.json({
    success: true,
    message: "Job updated successfully.",
    job: updatedJob,
  });
}

export async function handleAdminDeleteJob(
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

  const existing = await prisma.job.findUnique({
    where: { id },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Job opening not found." },
      { status: 404 }
    );
  }

  // Safe Retention Guard: Do not delete jobs with existing applications
  if (existing._count.applications > 0) {
    return NextResponse.json(
      {
        success: false,
        error: `Cannot delete job "${existing.title}" because it has ${existing._count.applications} active candidate application(s). Change the status to CLOSED to preserve applicant retention records.`,
      },
      { status: 409 }
    );
  }

  await prisma.job.delete({
    where: { id },
  });

  return NextResponse.json({
    success: true,
    message: "Job opening deleted successfully.",
  });
}
