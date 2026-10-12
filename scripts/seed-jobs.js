import { getPrismaClient } from "../lib/prisma.js";
import { jobsList } from "../app/careers/jobs-data.js";

async function seedJobs() {
  const prisma = getPrismaClient();
  if (!prisma) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  console.log(`Seeding ${jobsList.length} initial jobs into database...`);

  let createdCount = 0;
  let updatedCount = 0;

  for (const job of jobsList) {
    const existing = await prisma.job.findUnique({
      where: { linkSlug: job.linkSlug },
    });

    const data = {
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
    };

    if (existing) {
      await prisma.job.update({
        where: { linkSlug: job.linkSlug },
        data,
      });
      updatedCount++;
    } else {
      await prisma.job.create({
        data: {
          ...data,
          linkSlug: job.linkSlug,
        },
      });
      createdCount++;
    }
  }

  console.log(`Job seeding complete: ${createdCount} created, ${updatedCount} updated.`);
}

seedJobs()
  .catch((err) => {
    console.error("Error seeding jobs:", err);
    process.exit(1);
  })
  .finally(async () => {
    const prisma = getPrismaClient();
    if (prisma) await prisma.$disconnect?.();
  });
