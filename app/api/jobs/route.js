import { NextResponse } from "next/server";
import { prisma as defaultPrisma } from "../../../lib/prisma";
import { jobsList } from "../../careers/jobs-data";

export async function handleGetJobs({ prisma = defaultPrisma } = {}) {
  try {
    if (prisma && prisma.job) {
      const jobs = await prisma.job.findMany({
        where: {
          status: "PUBLISHED",
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return NextResponse.json({
        success: true,
        count: jobs.length,
        jobs,
      });
    }

    // Fallback if database is unconfigured
    if (!process.env.DATABASE_URL) {
      const fallbackJobs = jobsList.map((job) => ({
        ...job,
        status: "PUBLISHED",
      }));

      return NextResponse.json({
        success: true,
        count: fallbackJobs.length,
        jobs: fallbackJobs,
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
    console.error("[API: GET /api/jobs] Error:", error?.message);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch job listings at this time.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return handleGetJobs();
}
