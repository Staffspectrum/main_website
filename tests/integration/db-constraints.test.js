import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const testDbUrl = process.env.TEST_DATABASE_URL;

// Guard: Only run if TEST_DATABASE_URL is explicitly set and contains "test" in the database name
const isTestDbConfigured = Boolean(
  testDbUrl &&
    typeof testDbUrl === "string" &&
    (testDbUrl.includes("test") || testDbUrl.includes("localhost") || testDbUrl.includes("127.0.0.1"))
);

describe.runIf(isTestDbConfigured)(
  "PostgreSQL Live Integration: Constraints & Retention (Isolated Test Database)",
  () => {
    let pool;
    let prisma;

    beforeAll(async () => {
      // Safety confirmation: ensure we are NOT touching production or Django databases
      if (!testDbUrl.includes("test")) {
        throw new Error(
          "SAFETY ABORT: TEST_DATABASE_URL must explicitly contain 'test' in its database name."
        );
      }

      pool = new Pool({
        connectionString: testDbUrl,
        max: 2,
      });
      const adapter = new PrismaPg(pool);
      prisma = new PrismaClient({ adapter });
    });

    afterAll(async () => {
      if (prisma) {
        await prisma.$disconnect();
      }
      if (pool) {
        await pool.end();
      }
    });

    it("enforces unique email constraint on AdminUser in PostgreSQL", async () => {
      const email = `test-admin-${Date.now()}@example.com`;

      await prisma.adminUser.create({
        data: {
          email,
          passwordHash: "$2a$12$mockhashplaceholder",
          name: "Test Admin",
          role: "ADMIN",
        },
      });

      // Attempt duplicate email insertion
      await expect(
        prisma.adminUser.create({
          data: {
            email,
            passwordHash: "$2a$12$mockhashplaceholder2",
            name: "Duplicate Admin",
            role: "ADMIN",
          },
        })
      ).rejects.toThrow();
    });

    it("verifies default status='NEW' on ContactEnquiry in PostgreSQL", async () => {
      const enquiry = await prisma.contactEnquiry.create({
        data: {
          persona: "employer",
          interests: ["Recruitment"],
          name: "Test Client",
          email: "client@example.com",
          mobile: "9876543210",
          message: "Integration test contact enquiry",
        },
      });

      expect(enquiry.status).toBe("NEW");
    });

    it("enforces ON DELETE RESTRICT foreign key retention guard on Job with active applications", async () => {
      const slug = `test-job-${Date.now()}`;

      // 1. Create a Job
      const job = await prisma.job.create({
        data: {
          linkSlug: slug,
          title: "Test Engineer Role",
          department: "Engineering",
          location: "Remote",
          employmentType: "Full-Time",
          desc: "Brief test description",
          overview: "Full test overview text",
          status: "PUBLISHED",
        },
      });

      // 2. Create a JobApplication linked to this Job
      const application = await prisma.jobApplication.create({
        data: {
          jobId: job.id,
          applicantName: "Candidate One",
          email: "candidate@example.com",
          phone: "9876543210",
          r2ObjectKey: `test-resumes/${Date.now()}.pdf`,
          originalFileName: "candidate_cv.pdf",
          mimeType: "application/pdf",
          sizeBytes: 1024,
          status: "NEW",
        },
      });

      expect(application.jobId).toBe(job.id);

      // 3. Attempt direct database deletion of Job while application exists
      // PostgreSQL engine must reject with foreign key violation (ON DELETE RESTRICT)
      await expect(
        prisma.job.delete({
          where: { id: job.id },
        })
      ).rejects.toThrow();

      // Clean up application first, then job
      await prisma.jobApplication.delete({ where: { id: application.id } });
      await prisma.job.delete({ where: { id: job.id } });
    });
  }
);
