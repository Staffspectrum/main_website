import { describe, it, expect, beforeEach, vi } from "vitest";
import { handleContactPost } from "../../app/api/contact/route";
import { resetRateLimits } from "../../lib/security/rate-limit";

function createMockRequest(body, headers = {}) {
  const bodyText = typeof body === "string" ? body : JSON.stringify(body);
  const defaultHeaders = {
    "content-type": "application/json",
    "x-forwarded-for": "192.168.1.100",
    ...headers,
  };

  return {
    headers: {
      get: (key) => {
        const lowerKey = key.toLowerCase();
        return defaultHeaders[lowerKey] !== undefined ? defaultHeaders[lowerKey] : null;
      },
    },
    text: async () => bodyText,
  };
}

describe("Contact Us API Route Handler (/api/contact)", () => {
  let mockPrisma;
  let mockMailer;

  const validPayload = {
    persona: "employer",
    interests: ["Recruitment & Talent Acquisition", "Workforce Management"],
    name: "John Doe",
    email: "john.doe@example.com",
    mobile: "+91 98765 43210",
    message: "We need recruitment support for our Kochi office.",
  };

  beforeEach(() => {
    resetRateLimits();
    vi.clearAllMocks();

    mockPrisma = {
      contactEnquiry: {
        create: vi.fn().mockImplementation(async ({ data }) => ({
          id: "mock-enquiry-uuid-1234",
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        })),
        update: vi.fn().mockImplementation(async ({ where, data }) => ({
          id: where.id,
          ...data,
        })),
      },
    };

    mockMailer = vi.fn().mockResolvedValue({
      success: true,
      status: "SENT",
    });
  });

  describe("1. Valid Submissions", () => {
    it("successfully validates, saves enquiry to DB, and attempts email dispatch", async () => {
      const req = createMockRequest(validPayload);
      const res = await handleContactPost(req, {
        prisma: mockPrisma,
        mailer: mockMailer,
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.id).toBe("mock-enquiry-uuid-1234");

      // Verify Prisma was called to persist enquiry
      expect(mockPrisma.contactEnquiry.create).toHaveBeenCalledTimes(1);
      const createArgs = mockPrisma.contactEnquiry.create.mock.calls[0][0].data;
      expect(createArgs.name).toBe("John Doe");
      expect(createArgs.email).toBe("john.doe@example.com");
      expect(createArgs.emailStatus).toBe("PENDING");

      // Verify Mailer was invoked
      expect(mockMailer).toHaveBeenCalledTimes(1);
      expect(mockMailer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "mock-enquiry-uuid-1234",
          name: "John Doe",
          email: "john.doe@example.com",
        })
      );

      // Verify status was updated to SENT in DB
      expect(mockPrisma.contactEnquiry.update).toHaveBeenCalledWith({
        where: { id: "mock-enquiry-uuid-1234" },
        data: {
          emailStatus: "SENT",
          emailError: null,
        },
      });
    });

    it("accepts valid student persona with training interests", async () => {
      const studentPayload = {
        persona: "student",
        interests: ["CHRMP Training"],
        name: "Anjali Nair",
        email: "anjali.nair@example.com",
        mobile: "9847012345",
        message: "Interested in the upcoming CHRMP batch in Kochi.",
      };

      const req = createMockRequest(studentPayload);
      const res = await handleContactPost(req, {
        prisma: mockPrisma,
        mailer: mockMailer,
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });

  describe("2. Server-side Field Validations (Zod)", () => {
    it("rejects invalid persona", async () => {
      const invalid = { ...validPayload, persona: "investor" };
      const req = createMockRequest(invalid);
      const res = await handleContactPost(req, { prisma: mockPrisma });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.details).toHaveProperty("persona");
      expect(mockPrisma.contactEnquiry.create).not.toHaveBeenCalled();
    });

    it("rejects malformed email address", async () => {
      const invalid = { ...validPayload, email: "invalid-email-format" };
      const req = createMockRequest(invalid);
      const res = await handleContactPost(req, { prisma: mockPrisma });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.details).toHaveProperty("email");
    });

    it("rejects phone numbers with fewer than 10 digits", async () => {
      const invalid = { ...validPayload, mobile: "12345" };
      const req = createMockRequest(invalid);
      const res = await handleContactPost(req, { prisma: mockPrisma });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.details).toHaveProperty("mobile");
    });

    it("rejects empty or whitespace-only name", async () => {
      const invalid = { ...validPayload, name: "   " };
      const req = createMockRequest(invalid);
      const res = await handleContactPost(req, { prisma: mockPrisma });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.details).toHaveProperty("name");
    });

    it("rejects messages shorter than 3 characters", async () => {
      const invalid = { ...validPayload, message: "hi" };
      const req = createMockRequest(invalid);
      const res = await handleContactPost(req, { prisma: mockPrisma });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.details).toHaveProperty("message");
    });

    it("rejects malformed non-JSON payloads", async () => {
      const req = createMockRequest("this is not json {");
      const res = await handleContactPost(req, { prisma: mockPrisma });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid JSON payload.");
    });
  });

  describe("3. Payload Size Limits", () => {
    it("rejects payloads exceeding the 32 KB limit via content-length header", async () => {
      const req = createMockRequest(validPayload, {
        "content-length": "40000",
      });
      const res = await handleContactPost(req, { prisma: mockPrisma });

      expect(res.status).toBe(413);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Request payload is too large");
    });

    it("rejects raw text body exceeding 32 KB limit", async () => {
      const giantMessage = "A".repeat(35000);
      const req = createMockRequest(giantMessage);
      const res = await handleContactPost(req, { prisma: mockPrisma });

      expect(res.status).toBe(413);
    });
  });

  describe("4. Database Failure Handling", () => {
    it("returns 500 without leaking database credentials if database creation fails", async () => {
      mockPrisma.contactEnquiry.create.mockRejectedValueOnce(
        new Error("Connection to database server closed unexpectedly")
      );

      const req = createMockRequest(validPayload);
      const res = await handleContactPost(req, {
        prisma: mockPrisma,
        mailer: mockMailer,
      });

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        "We were unable to save your enquiry at this moment. Please try again shortly."
      );
      // Mailer should NOT be called if DB save failed
      expect(mockMailer).not.toHaveBeenCalled();
    });

    it("returns 500 if prisma client is null or not configured", async () => {
      const req = createMockRequest(validPayload);
      const res = await handleContactPost(req, {
        prisma: null,
      });

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.success).toBe(false);
    });
  });

  describe("5. Email Failure Handling (Preserve enquiry in DB)", () => {
    it("preserves enquiry in DB and marks emailStatus as FAILED if mailer throws or fails", async () => {
      mockMailer.mockResolvedValueOnce({
        success: false,
        status: "FAILED",
        error: "SMTP connect ETIMEDOUT 192.0.2.1",
      });

      const req = createMockRequest(validPayload);
      const res = await handleContactPost(req, {
        prisma: mockPrisma,
        mailer: mockMailer,
      });

      // The customer still receives success because their enquiry was safely saved
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);

      // Verify that the DB was updated with FAILED status and sanitized error
      expect(mockPrisma.contactEnquiry.update).toHaveBeenCalledWith({
        where: { id: "mock-enquiry-uuid-1234" },
        data: {
          emailStatus: "FAILED",
          emailError: "SMTP connect ETIMEDOUT 192.0.2.1",
        },
      });
    });

    it("handles mailer rejection gracefully without failing customer response", async () => {
      mockMailer.mockRejectedValueOnce(new Error("Unexpected mail server network drop"));

      const req = createMockRequest(validPayload);
      const res = await handleContactPost(req, {
        prisma: mockPrisma,
        mailer: mockMailer,
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });

  describe("6. Abuse Protection & Repeated Submissions (Rate Limiting)", () => {
    it("allows up to 5 submissions within window and blocks 6th with 429", async () => {
      const ip = "203.0.113.45";

      for (let i = 0; i < 5; i++) {
        const req = createMockRequest(validPayload, { "x-forwarded-for": ip });
        const res = await handleContactPost(req, {
          prisma: mockPrisma,
          mailer: mockMailer,
        });
        expect(res.status).toBe(201);
      }

      // 6th attempt from the same IP
      const blockedReq = createMockRequest(validPayload, { "x-forwarded-for": ip });
      const blockedRes = await handleContactPost(blockedReq, {
        prisma: mockPrisma,
        mailer: mockMailer,
      });

      expect(blockedRes.status).toBe(429);
      const data = await blockedRes.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Too many submissions");
      expect(blockedRes.headers.get("retry-after")).toBeTruthy();

      // Ensure DB was not called for blocked request
      expect(mockPrisma.contactEnquiry.create).toHaveBeenCalledTimes(5);
    });
  });
});
