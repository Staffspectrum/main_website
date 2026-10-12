import { describe, it, expect, beforeEach, vi } from "vitest";
import { handleGetJobs } from "../../app/api/jobs/route";
import { handleGetJobBySlug } from "../../app/api/jobs/[slug]/route";
import { getPublishedJobs, getPublishedJobBySlug } from "../../lib/data/jobs";

describe("Careers & Jobs Backend (Phase 2)", () => {
  let mockPrisma;

  const mockDbJobs = [
    {
      id: "job-1",
      linkSlug: "hr-manager",
      title: "HR Manager",
      department: "Human Resources",
      location: "InfoPark, Kerala",
      employmentType: "Full-Time",
      experienceLevel: "8+ Years",
      qualification: "MBA",
      desc: "Hiring an HR Manager",
      overview: "Overview of HR Manager",
      responsibilities: ["Task 1", "Task 2"],
      requirements: ["Req 1", "Req 2"],
      benefits: ["Benefit 1"],
      status: "PUBLISHED",
      createdAt: new Date("2026-01-01"),
    },
    {
      id: "job-2",
      linkSlug: "content-writer",
      title: "Content Writer",
      department: "Creative & Editorial",
      location: "Kochi, Kerala",
      employmentType: "Full-Time",
      experienceLevel: "2-5 Years",
      qualification: "BA",
      desc: "Hiring Content Writer",
      overview: "Overview of Content Writer",
      responsibilities: ["Write articles"],
      requirements: ["SEO knowledge"],
      benefits: ["Flexible hours"],
      status: "PUBLISHED",
      createdAt: new Date("2026-01-02"),
    },
    {
      id: "job-3",
      linkSlug: "draft-engineer",
      title: "Draft Engineer",
      department: "Engineering",
      location: "Remote",
      employmentType: "Full-Time",
      desc: "Draft description",
      overview: "Draft overview",
      responsibilities: [],
      requirements: [],
      benefits: [],
      status: "DRAFT", // Should NEVER be exposed publicly
      createdAt: new Date("2026-01-03"),
    },
    {
      id: "job-4",
      linkSlug: "closed-designer",
      title: "Closed Designer",
      department: "Design",
      location: "InfoPark",
      employmentType: "Full-Time",
      desc: "Closed position",
      overview: "Closed overview",
      responsibilities: [],
      requirements: [],
      benefits: [],
      status: "CLOSED", // Should NEVER be exposed publicly
      createdAt: new Date("2026-01-04"),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    mockPrisma = {
      job: {
        findMany: vi.fn().mockImplementation(async ({ where }) => {
          return mockDbJobs.filter((job) => {
            if (where?.status && job.status !== where.status) return false;
            return true;
          });
        }),
        findFirst: vi.fn().mockImplementation(async ({ where }) => {
          return (
            mockDbJobs.find((job) => {
              if (where?.linkSlug && job.linkSlug !== where.linkSlug) return false;
              if (where?.status && job.status !== where.status) return false;
              return true;
            }) || null
          );
        }),
      },
    };
  });

  describe("1. GET /api/jobs (Job Status Filtering)", () => {
    it("returns ONLY published jobs, strictly excluding DRAFT and CLOSED listings", async () => {
      const res = await handleGetJobs({ prisma: mockPrisma });
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.count).toBe(2);
      expect(data.jobs).toHaveLength(2);

      const slugs = data.jobs.map((j) => j.linkSlug);
      expect(slugs).toContain("hr-manager");
      expect(slugs).toContain("content-writer");
      expect(slugs).not.toContain("draft-engineer");
      expect(slugs).not.toContain("closed-designer");

      // Verify Prisma query was called with status: 'PUBLISHED'
      expect(mockPrisma.job.findMany).toHaveBeenCalledWith({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "asc" },
      });
    });

    it("returns 500 when database encounters a query error", async () => {
      mockPrisma.job.findMany.mockRejectedValueOnce(
        new Error("Connection pool exhausted")
      );

      const res = await handleGetJobs({ prisma: mockPrisma });
      expect(res.status).toBe(500);

      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unable to fetch job listings at this time.");
    });
  });

  describe("2. GET /api/jobs/[slug] (Job Detail & Slug Resolution)", () => {
    it("returns a single published job by slug", async () => {
      const res = await handleGetJobBySlug(Promise.resolve({ slug: "hr-manager" }), {
        prisma: mockPrisma,
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.job.linkSlug).toBe("hr-manager");
      expect(data.job.title).toBe("HR Manager");
      expect(data.job.status).toBe("PUBLISHED");

      expect(mockPrisma.job.findFirst).toHaveBeenCalledWith({
        where: {
          linkSlug: "hr-manager",
          status: "PUBLISHED",
        },
      });
    });

    it("returns 404 for a job that exists in DB but has DRAFT status", async () => {
      const res = await handleGetJobBySlug(Promise.resolve({ slug: "draft-engineer" }), {
        prisma: mockPrisma,
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Job opening not found or no longer active.");
    });

    it("returns 404 for a job that exists in DB but has CLOSED status", async () => {
      const res = await handleGetJobBySlug(Promise.resolve({ slug: "closed-designer" }), {
        prisma: mockPrisma,
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Job opening not found or no longer active.");
    });

    it("returns 404 for a completely non-existent slug", async () => {
      const res = await handleGetJobBySlug(Promise.resolve({ slug: "non-existent-role" }), {
        prisma: mockPrisma,
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Job opening not found or no longer active.");
    });

    it("returns 400 for empty or invalid slug parameter", async () => {
      const res = await handleGetJobBySlug(Promise.resolve({ slug: "" }), {
        prisma: mockPrisma,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
    });

    it("returns 500 when database throws an unexpected error", async () => {
      mockPrisma.job.findFirst.mockRejectedValueOnce(
        new Error("Database disk read error")
      );

      const res = await handleGetJobBySlug(Promise.resolve({ slug: "hr-manager" }), {
        prisma: mockPrisma,
      });

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unable to retrieve job details at this time.");
    });
  });

  describe("3. Data Access Layer (lib/data/jobs.js)", () => {
    it("getPublishedJobs filters out non-published jobs from database", async () => {
      const jobs = await getPublishedJobs(mockPrisma);
      expect(jobs).toHaveLength(2);
      expect(jobs.every((j) => j.status === "PUBLISHED")).toBe(true);
    });

    it("getPublishedJobBySlug returns null for DRAFT and CLOSED jobs", async () => {
      const draft = await getPublishedJobBySlug("draft-engineer", mockPrisma);
      expect(draft).toBeNull();

      const closed = await getPublishedJobBySlug("closed-designer", mockPrisma);
      expect(closed).toBeNull();
    });

    it("getPublishedJobBySlug returns the published job when valid", async () => {
      const job = await getPublishedJobBySlug("content-writer", mockPrisma);
      expect(job).not.toBeNull();
      expect(job.title).toBe("Content Writer");
      expect(job.status).toBe("PUBLISHED");
    });
  });
});
