import { describe, it, expect, beforeEach, vi } from "vitest";
import { handleJobApplicationPost } from "../../app/api/jobs/[slug]/apply/route";

function createMockRequest(formData, headers = {}) {
  const defaultHeaders = {
    "x-forwarded-for": "203.0.113.19",
    ...headers,
  };

  return {
    headers: {
      get: (key) => {
        const lowerKey = key.toLowerCase();
        return defaultHeaders[lowerKey] !== undefined ? defaultHeaders[lowerKey] : null;
      },
    },
    formData: async () => formData,
  };
}

describe("Job Application Submission & R2 Storage (/api/jobs/[slug]/apply)", () => {
  let mockPrisma;
  let mockUploader;
  let mockDeleter;

  const validPdfBytes = Buffer.from("%PDF-1.7\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF");

  const publishedJob = {
    id: "job-hr-manager-uuid",
    linkSlug: "hr-manager",
    title: "HR Manager",
    status: "PUBLISHED",
  };

  const closedJob = {
    id: "job-closed-uuid",
    linkSlug: "closed-role",
    title: "Closed Role",
    status: "CLOSED",
  };

  const draftJob = {
    id: "job-draft-uuid",
    linkSlug: "draft-role",
    title: "Draft Role",
    status: "DRAFT",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockPrisma = {
      job: {
        findFirst: vi.fn().mockImplementation(async ({ where }) => {
          if (where.linkSlug === "hr-manager") return publishedJob;
          if (where.linkSlug === "closed-role") return closedJob;
          if (where.linkSlug === "draft-role") return draftJob;
          return null;
        }),
      },
      jobApplication: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockImplementation(async ({ data }) => ({
          id: "mock-application-uuid-999",
          createdAt: new Date(),
          ...data,
        })),
      },
    };

    mockUploader = vi.fn().mockResolvedValue({
      r2ObjectKey: "resumes/987e6543-e21b-12d3-a456-426614174000.pdf",
      originalFileName: "alice_resume.pdf",
      sizeBytes: validPdfBytes.length,
      mimeType: "application/pdf",
    });

    mockDeleter = vi.fn().mockResolvedValue();
  });

  function createValidFormData() {
    const fd = new FormData();
    fd.append("name", "Alice Johnson");
    fd.append("email", "alice@example.com");
    fd.append("phone", "+91 9876543210");
    fd.append("location", "Kochi, Kerala");
    fd.append("experience", "5 Years");
    fd.append("portfolio", "https://alice.dev");
    fd.append("note", "Excited to apply for this position.");

    const file = new File([validPdfBytes], "alice_resume.pdf", { type: "application/pdf" });
    fd.append("cv", file);
    return fd;
  }

  describe("1. Valid Application Submissions", () => {
    it("successfully validates, uploads CV to R2 with UUID key, and saves application to DB", async () => {
      const formData = createValidFormData();
      const req = createMockRequest(formData);

      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "hr-manager" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
        deleter: mockDeleter,
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.id).toBe("mock-application-uuid-999");

      // Verify R2 uploader was called
      expect(mockUploader).toHaveBeenCalledTimes(1);
      const uploadArgs = mockUploader.mock.calls[0][0];
      expect(uploadArgs.originalFileName).toBe("alice_resume.pdf");
      expect(uploadArgs.mimeType).toBe("application/pdf");

      // Verify DB creation
      expect(mockPrisma.jobApplication.create).toHaveBeenCalledTimes(1);
      const createData = mockPrisma.jobApplication.create.mock.calls[0][0].data;
      expect(createData.jobId).toBe("job-hr-manager-uuid");
      expect(createData.applicantName).toBe("Alice Johnson");
      expect(createData.email).toBe("alice@example.com");
      expect(createData.phone).toBe("+91 9876543210");
      expect(createData.r2ObjectKey).toBe("resumes/987e6543-e21b-12d3-a456-426614174000.pdf");
      expect(createData.status).toBe("NEW");

      // Verify rollback deleter was NOT called
      expect(mockDeleter).not.toHaveBeenCalled();
    });
  });

  describe("2. PDF & File Signature Validations", () => {
    it("rejects non-PDF files (e.g. .docx or text files)", async () => {
      const fd = createValidFormData();
      const docxFile = new File([Buffer.from("word-data")], "resume.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      fd.set("cv", docxFile);

      const req = createMockRequest(fd);
      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "hr-manager" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Only PDF documents are accepted");
      expect(mockUploader).not.toHaveBeenCalled();
    });

    it("rejects fake PDF files lacking the %PDF- magic byte signature", async () => {
      const fd = createValidFormData();
      // File named .pdf with text content instead of PDF magic bytes
      const fakePdfFile = new File([Buffer.from("This is plain text not a real pdf")], "fake.pdf", {
        type: "application/pdf",
      });
      fd.set("cv", fakePdfFile);

      const req = createMockRequest(fd);
      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "hr-manager" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("genuine PDF signature");
      expect(mockUploader).not.toHaveBeenCalled();
    });

    it("rejects files exceeding the strict 10 MB limit", async () => {
      const fd = createValidFormData();
      // 10 MB + 1 KB buffer
      const giantBytes = Buffer.alloc(10 * 1024 * 1024 + 1024);
      giantBytes.write("%PDF-1.4", 0);
      const giantFile = new File([giantBytes], "large_portfolio.pdf", {
        type: "application/pdf",
      });
      fd.set("cv", giantFile);

      const req = createMockRequest(fd);
      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "hr-manager" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
      });

      expect(res.status).toBe(413);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("10 MB size limit");
      expect(mockUploader).not.toHaveBeenCalled();
    });

    it("rejects submissions without a CV file attached", async () => {
      const fd = createValidFormData();
      fd.delete("cv");

      const req = createMockRequest(fd);
      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "hr-manager" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Please upload your CV");
    });
  });

  describe("3. Job Status & Slug Rejections", () => {
    it("returns 404 for non-existent job slugs", async () => {
      const fd = createValidFormData();
      const req = createMockRequest(fd);

      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "unknown-position" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Job opening not found.");
      expect(mockUploader).not.toHaveBeenCalled();
    });

    it("rejects applications for CLOSED jobs", async () => {
      const fd = createValidFormData();
      const req = createMockRequest(fd);

      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "closed-role" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("currently closed");
      expect(mockUploader).not.toHaveBeenCalled();
    });

    it("rejects applications for DRAFT jobs", async () => {
      const fd = createValidFormData();
      const req = createMockRequest(fd);

      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "draft-role" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("currently closed");
      expect(mockUploader).not.toHaveBeenCalled();
    });
  });

  describe("4. Failure Handling & Orphaned Object Cleanup", () => {
    it("returns 500 without database write if R2 upload fails", async () => {
      mockUploader.mockRejectedValueOnce(new Error("R2 endpoint connection timeout"));

      const fd = createValidFormData();
      const req = createMockRequest(fd);

      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "hr-manager" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
        deleter: mockDeleter,
      });

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Unable to process document storage");

      // Verify no database record was created
      expect(mockPrisma.jobApplication.create).not.toHaveBeenCalled();
      // Nothing was uploaded, so deleter shouldn't be called
      expect(mockDeleter).not.toHaveBeenCalled();
    });

    it("cleans up orphaned R2 object if database save fails after successful upload", async () => {
      mockPrisma.jobApplication.create.mockRejectedValueOnce(
        new Error("PostgreSQL foreign key violation")
      );

      const fd = createValidFormData();
      const req = createMockRequest(fd);

      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "hr-manager" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
        deleter: mockDeleter,
      });

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Unable to record your application");

      // Crucial: verify that the uploaded R2 key was deleted to prevent orphaned storage
      expect(mockDeleter).toHaveBeenCalledWith("resumes/987e6543-e21b-12d3-a456-426614174000.pdf");
    });
  });

  describe("5. Duplicate Submission Protection", () => {
    it("rejects duplicate applications within 5 minutes from the same email for the same role", async () => {
      mockPrisma.jobApplication.findFirst.mockResolvedValueOnce({
        id: "existing-application-id",
        email: "alice@example.com",
        jobId: "job-hr-manager-uuid",
        createdAt: new Date(),
      });

      const fd = createValidFormData();
      const req = createMockRequest(fd);

      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "hr-manager" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
        deleter: mockDeleter,
      });

      expect(res.status).toBe(409);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("recently received");

      expect(mockUploader).not.toHaveBeenCalled();
      expect(mockPrisma.jobApplication.create).not.toHaveBeenCalled();
    });
  });

  describe("6. Upload Resource Guards & Request Metering", () => {
    it("rejects request early with 413 when Content-Length exceeds 12 MB limit", async () => {
      const fd = createValidFormData();
      const req = createMockRequest(fd, {
        "content-length": String(15 * 1024 * 1024), // 15 MB
      });

      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "hr-manager" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
      });

      expect(res.status).toBe(413);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("exceeds maximum allowed upload size");
      expect(mockUploader).not.toHaveBeenCalled();
    });

    it("rejects request with 400 when Content-Length is non-numeric or negative", async () => {
      const fd = createValidFormData();
      const req = createMockRequest(fd, {
        "content-length": "invalid-not-a-number",
      });

      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "hr-manager" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid Content-Length header");
    });

    it("rejects malformed multipart form submissions with 400", async () => {
      const req = {
        headers: {
          get: () => null,
        },
        formData: async () => {
          throw new Error("Malformed multipart body syntax");
        },
      };

      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "hr-manager" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid or malformed form submission");
    });

    it("handles R2 cleanup failure gracefully if deleter fails during database error cleanup", async () => {
      mockPrisma.jobApplication.create.mockRejectedValueOnce(new Error("Fatal DB Error"));
      mockDeleter.mockRejectedValueOnce(new Error("R2 Deleter Network Error"));

      const fd = createValidFormData();
      const req = createMockRequest(fd);

      const res = await handleJobApplicationPost(req, Promise.resolve({ slug: "hr-manager" }), {
        prisma: mockPrisma,
        uploader: mockUploader,
        deleter: mockDeleter,
      });

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.success).toBe(false);
    });
  });
});
