import { prisma } from "../prisma";
import { jobsList } from "../../app/careers/jobs-data";

/**
 * Fetch all PUBLISHED jobs.
 * Only jobs with status === 'PUBLISHED' are returned to public callers.
 */
export async function getPublishedJobs(client = prisma) {
  try {
    if (client && client.job) {
      const dbJobs = await client.job.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "asc" },
      });

      if (dbJobs && dbJobs.length > 0) {
        return dbJobs;
      }
    }
  } catch (err) {
    console.error("[Data: Jobs] Database fetch failed, falling back to static jobsList:", err?.message);
  }

  // Graceful fallback for unconfigured environments (e.g. static build or initial setup)
  return jobsList.map((job) => ({
    ...job,
    status: "PUBLISHED",
  }));
}

/**
 * Fetch a single PUBLISHED job by linkSlug.
 * Returns null if the job does not exist or its status is not PUBLISHED.
 */
export async function getPublishedJobBySlug(slug, client = prisma) {
  if (!slug) return null;

  try {
    if (client && client.job) {
      const dbJob = await client.job.findFirst({
        where: {
          linkSlug: slug,
          status: "PUBLISHED",
        },
      });

      // If a database query was executed, respect its result strictly
      // (If the job exists as DRAFT or CLOSED, dbJob will be null)
      if (dbJob !== undefined) {
        return dbJob;
      }
    }
  } catch (err) {
    console.error(`[Data: Jobs] Database fetch failed for slug "${slug}":`, err?.message);
    // If database errored out completely, rethrow or return fallback if DB is not configured
    if (!process.env.DATABASE_URL) {
      const fallback = jobsList.find((j) => j.linkSlug === slug);
      return fallback ? { ...fallback, status: "PUBLISHED" } : null;
    }
    throw err;
  }

  // Fallback if DATABASE_URL is not configured
  if (!process.env.DATABASE_URL) {
    const fallback = jobsList.find((j) => j.linkSlug === slug);
    return fallback ? { ...fallback, status: "PUBLISHED" } : null;
  }

  return null;
}
