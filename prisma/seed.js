import { getPrismaClient } from "../lib/prisma.js";
import { jobsList } from "../app/careers/jobs-data.js";

async function main() {
  const prisma = getPrismaClient();
  if (!prisma) {
    console.log("No DATABASE_URL configured. Skipping database seed.");
    return;
  }

  console.log(`Starting seed: inserting ${jobsList.length} static jobs into PostgreSQL...`);

  for (const job of jobsList) {
    await prisma.job.upsert({
      where: { linkSlug: job.linkSlug },
      update: {
        title: job.title,
        department: job.department,
        location: job.location,
        employmentType: job.employmentType || "Full-Time",
        experienceLevel: job.experienceLevel || null,
        qualification: job.qualification || null,
        desc: job.desc,
        overview: job.overview,
        responsibilities: job.responsibilities || [],
        requirements: job.requirements || [],
        benefits: job.benefits || [],
        status: "PUBLISHED",
      },
      create: {
        linkSlug: job.linkSlug,
        title: job.title,
        department: job.department,
        location: job.location,
        employmentType: job.employmentType || "Full-Time",
        experienceLevel: job.experienceLevel || null,
        qualification: job.qualification || null,
        desc: job.desc,
        overview: job.overview,
        responsibilities: job.responsibilities || [],
        requirements: job.requirements || [],
        benefits: job.benefits || [],
        status: "PUBLISHED",
      },
    });
  }

  console.log("Successfully seeded jobs into PostgreSQL database!");
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
