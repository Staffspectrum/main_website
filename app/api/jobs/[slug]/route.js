import { NextResponse } from "next/server";
import { prisma as defaultPrisma } from "../../../../lib/prisma";
import { jobsList } from "../../../careers/jobs-data";

export async function handleGetJobBySlug(paramsPromise, { prisma = defaultPrisma } = {}) {
  try {
    const resolvedParams = await paramsPromise;
    const slug = resolvedParams?.slug;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "A valid job slug is required.",
        },
        { status: 400 }
      );
    }

    if (prisma && prisma.job) {
      const job = await prisma.job.findFirst({
        where: {
          linkSlug: slug,
          status: "PUBLISHED",
        },
      });

      if (!job) {
        return NextResponse.json(
          {
            success: false,
            error: "Job opening not found or no longer active.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        job,
      });
    }

    // Fallback if database is unconfigured
    if (!process.env.DATABASE_URL) {
      const fallbackJob = jobsList.find((j) => j.linkSlug === slug);
      if (!fallbackJob) {
        return NextResponse.json(
          {
            success: false,
            error: "Job opening not found or no longer active.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        job: {
          ...fallbackJob,
          status: "PUBLISHED",
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Database service is unavailable.",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("[API: GET /api/jobs/[slug]] Error:", error?.message);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to retrieve job details at this time.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  return handleGetJobBySlug(params);
}
