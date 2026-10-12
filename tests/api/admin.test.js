import { describe, it, expect, beforeEach, vi } from "vitest";
import { handleAdminLogin } from "../../app/api/admin/auth/login/handler";
import { POST as handleAdminLogout } from "../../app/api/admin/auth/logout/route";
import { GET as handleAdminMe } from "../../app/api/admin/auth/me/route";
import {
  handleAdminGetJobs,
  handleAdminCreateJob,
} from "../../app/api/admin/jobs/handler";
import {
  handleAdminGetJobById,
  handleAdminUpdateJob,
  handleAdminDeleteJob,
} from "../../app/api/admin/jobs/[id]/handler";
import { handleAdminUpdateJobStatus } from "../../app/api/admin/jobs/[id]/status/handler";
import { handleAdminGetApplications } from "../../app/api/admin/applications/handler";
import { handleAdminDeleteApplication } from "../../app/api/admin/applications/[id]/handler";
import { handleAdminUpdateApplicationStatus } from "../../app/api/admin/applications/[id]/status/handler";
import { handleAdminGetResume } from "../../app/api/admin/applications/[id]/resume/handler";
import { handleAdminGetEnquiries } from "../../app/api/admin/enquiries/handler";
import { handleAdminUpdateEnquiryStatus } from "../../app/api/admin/enquiries/[id]/status/handler";
import { handleAdminDeleteEnquiry } from "../../app/api/admin/enquiries/[id]/handler";
import { purgeOldResolvedEnquiries } from "../../lib/data/enquiry-cleanup";
import { SignJWT } from "jose";
import {
  createSessionToken,
  verifySessionToken,
  SESSION_COOKIE_NAME,
} from "../../lib/auth/session";
import {
  checkLoginThrottle,
  recordLoginFailure,
  recordLoginSuccess,
  resetLoginThrottles,
} from "../../lib/security/login-throttle";
import {
  verifySameOrigin,
  enforceSameOrigin,
} from "../../lib/security/csrf";
import {
  validateAdminPassword,
  provisionAdminAccount,
} from "../../scripts/create-admin";

function createJsonRequest(body = {}, headers = {}, method = "POST") {
  const defaultHeaders = {
    "x-forwarded-for": "198.51.100.42",
    host: "example.com",
    origin: "https://example.com",
    ...headers,
  };

  return {
    method,
    headers: {
      get: (key) => {
        const lowerKey = key.toLowerCase();
        return defaultHeaders[lowerKey] !== undefined ? defaultHeaders[lowerKey] : null;
      },
    },
    json: async () => body,
    url: "https://example.com/api/admin",
  };
}

describe("StaffSpectrum Admin Backend & Management (Phase 4)", () => {
  const mockAdminUser = {
    id: "admin-uuid-1",
    email: "admin@staffspectrum.com",
    name: "StaffSpectrum Administrator",
    role: "ADMIN",
    passwordHash: "$2a$12$hashedPasswordPlaceholder",
  };

  const mockAdminSession = {
    sub: "admin-uuid-1",
    email: "admin@staffspectrum.com",
    name: "StaffSpectrum Administrator",
    role: "ADMIN",
  };

  const authedVerifier = async () => mockAdminSession;
  const unauthedVerifier = async () => null;

  beforeEach(() => {
    vi.clearAllMocks();
    resetLoginThrottles();
  });

  // =========================================================================
  // 1. AUTHENTICATION, SESSIONS & THROTTLING
  // =========================================================================
  describe("Admin Authentication & Session Security", () => {
    it("logs in successfully with valid credentials and sets HTTP-only cookie", async () => {
      const mockPrisma = {
        adminUser: {
          findUnique: vi.fn().mockResolvedValue(mockAdminUser),
        },
      };

      const mockHasher = {
        compare: vi.fn().mockResolvedValue(true),
      };

      const req = createJsonRequest({
        email: "admin@staffspectrum.com",
        password: "SuperSecretPassword123!",
      });

      const res = await handleAdminLogin(req, {
        prisma: mockPrisma,
        hasher: mockHasher,
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.user.email).toBe("admin@staffspectrum.com");
      expect(json.user.name).toBe("StaffSpectrum Administrator");

      // Verify cookie
      const cookieHeader = res.cookies.get(SESSION_COOKIE_NAME);
      expect(cookieHeader).toBeDefined();
      expect(cookieHeader.value).toBeTruthy();
      expect(cookieHeader.httpOnly).toBe(true);
      expect(cookieHeader.sameSite).toBe("lax");
    });

    it("rejects invalid password with 401 and records throttle failure", async () => {
      const mockPrisma = {
        adminUser: {
          findUnique: vi.fn().mockResolvedValue(mockAdminUser),
        },
      };

      const mockHasher = {
        compare: vi.fn().mockResolvedValue(false),
      };

      const req = createJsonRequest({
        email: "admin@staffspectrum.com",
        password: "WrongPassword!",
      });

      const res = await handleAdminLogin(req, {
        prisma: mockPrisma,
        hasher: mockHasher,
      });

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe("Invalid email or password.");
    });

    it("rejects non-existent admin email with 401", async () => {
      const mockPrisma = {
        adminUser: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      };

      const req = createJsonRequest({
        email: "ghost@staffspectrum.com",
        password: "SomePassword123!",
      });

      const res = await handleAdminLogin(req, {
        prisma: mockPrisma,
      });

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe("Invalid email or password.");
    });

    it("enforces login throttling after 5 failed attempts (returns 429 with Retry-After)", async () => {
      const clientIp = "198.51.100.99";

      // Trigger 5 failures
      for (let i = 0; i < 5; i++) {
        recordLoginFailure(clientIp);
      }

      const req = createJsonRequest(
        { email: "admin@staffspectrum.com", password: "pwd" },
        { "x-forwarded-for": clientIp }
      );

      const res = await handleAdminLogin(req);
      expect(res.status).toBe(429);
      expect(res.headers.get("retry-after")).toBeTruthy();
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Too many failed login attempts");
    });

    it("clears failed throttle attempts upon successful login", async () => {
      const clientIp = "198.51.100.88";
      recordLoginFailure(clientIp);
      recordLoginFailure(clientIp);
      expect(checkLoginThrottle(clientIp).remaining).toBe(3);

      recordLoginSuccess(clientIp);
      expect(checkLoginThrottle(clientIp).remaining).toBe(5);
    });

    it("generates and verifies jose JWT session tokens", async () => {
      const token = await createSessionToken({
        id: "usr-123",
        email: "lead@staffspectrum.com",
        name: "Lead Admin",
        role: "ADMIN",
      });

      expect(typeof token).toBe("string");
      const decoded = await verifySessionToken(token);
      expect(decoded).toBeTruthy();
      expect(decoded.sub).toBe("usr-123");
      expect(decoded.email).toBe("lead@staffspectrum.com");
      expect(decoded.name).toBe("Lead Admin");
    });

    it("returns null when verifying invalid session tokens", async () => {
      const invalid = await verifySessionToken("totally-invalid.jwt.token");
      expect(invalid).toBeNull();

      const nullToken = await verifySessionToken(null);
      expect(nullToken).toBeNull();
    });

    it("returns null when verifying an authentic token that has reached expiration", async () => {
      const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET);
      const pastSeconds = Math.floor(Date.now() / 1000) - 300; // 5 minutes in the past

      const expiredJwt = await new SignJWT({
        sub: "admin-uuid-1",
        email: "admin@staffspectrum.com",
        name: "Admin",
        role: "ADMIN",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt(pastSeconds - 100)
        .setExpirationTime(pastSeconds)
        .sign(secret);

      const result = await verifySessionToken(expiredJwt);
      expect(result).toBeNull();
    });

    it("throws an error when ADMIN_JWT_SECRET is unset or under 32 characters", async () => {
      const originalSecret = process.env.ADMIN_JWT_SECRET;
      try {
        process.env.ADMIN_JWT_SECRET = "too-short";
        await expect(createSessionToken(mockAdminUser)).rejects.toThrow("insufficiently secure");

        delete process.env.ADMIN_JWT_SECRET;
        await expect(createSessionToken(mockAdminUser)).rejects.toThrow("ADMIN_JWT_SECRET environment variable is required");
      } finally {
        process.env.ADMIN_JWT_SECRET = originalSecret;
      }
    });

    it("throttles targeted account email even when requests originate from different client IPs", async () => {
      const targetEmail = "targeted-admin@staffspectrum.com";

      // Simulate 5 attempts from 5 completely different IPs targeting the same email
      for (let i = 1; i <= 5; i++) {
        recordLoginFailure({ clientIp: `203.0.113.${i}`, email: targetEmail });
      }

      // 6th attempt from a fresh 6th IP should be throttled because account is locked
      const check = checkLoginThrottle({ clientIp: "198.51.100.99", email: targetEmail });
      expect(check.allowed).toBe(false);
      expect(check.retryAfter).toBeGreaterThan(0);
    });

    it("clears session cookie on logout", async () => {
      const res = await handleAdminLogout();
      expect(res.status).toBe(200);
      const cookie = res.cookies.get(SESSION_COOKIE_NAME);
      expect(cookie).toBeDefined();
      expect(cookie.maxAge).toBe(0);
    });

    it("returns authenticated user profile on /api/admin/auth/me", async () => {
      const validReq = {
        cookies: {
          get: (name) => {
            if (name === SESSION_COOKIE_NAME) return { value: "test-token" };
            return null;
          },
        },
      };

      // Mock verifySessionToken to return payload
      const validToken = await createSessionToken(mockAdminUser);
      const req = {
        cookies: {
          get: () => ({ value: validToken }),
        },
      };

      const res = await handleAdminMe(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.user.email).toBe(mockAdminUser.email);
    });
  });

  // =========================================================================
  // 2. SERVER-SIDE AUTHORIZATION CHECKS ON EVERY ADMIN ENDPOINT
  // =========================================================================
  describe("Server-Side Authorization Enforcement", () => {
    it("rejects unauthenticated requests to GET /api/admin/jobs with 401", async () => {
      const req = createJsonRequest();
      const res = await handleAdminGetJobs(req, { sessionVerifier: unauthedVerifier });
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated requests to POST /api/admin/jobs with 401", async () => {
      const req = createJsonRequest({});
      const res = await handleAdminCreateJob(req, { sessionVerifier: unauthedVerifier });
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated requests to GET /api/admin/jobs/[id] with 401", async () => {
      const req = createJsonRequest();
      const res = await handleAdminGetJobById(req, Promise.resolve({ id: "job-1" }), {
        sessionVerifier: unauthedVerifier,
      });
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated requests to PUT /api/admin/jobs/[id] with 401", async () => {
      const req = createJsonRequest({});
      const res = await handleAdminUpdateJob(req, Promise.resolve({ id: "job-1" }), {
        sessionVerifier: unauthedVerifier,
      });
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated requests to DELETE /api/admin/jobs/[id] with 401", async () => {
      const req = createJsonRequest();
      const res = await handleAdminDeleteJob(req, Promise.resolve({ id: "job-1" }), {
        sessionVerifier: unauthedVerifier,
      });
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated requests to PATCH /api/admin/jobs/[id]/status with 401", async () => {
      const req = createJsonRequest({ status: "CLOSED" });
      const res = await handleAdminUpdateJobStatus(req, Promise.resolve({ id: "job-1" }), {
        sessionVerifier: unauthedVerifier,
      });
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated requests to GET /api/admin/applications with 401", async () => {
      const req = createJsonRequest();
      const res = await handleAdminGetApplications(req, { sessionVerifier: unauthedVerifier });
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated requests to PATCH /api/admin/applications/[id]/status with 401", async () => {
      const req = createJsonRequest({ status: "REVIEWED" });
      const res = await handleAdminUpdateApplicationStatus(req, Promise.resolve({ id: "app-1" }), {
        sessionVerifier: unauthedVerifier,
      });
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated requests to GET /api/admin/applications/[id]/resume with 401", async () => {
      const req = createJsonRequest();
      const res = await handleAdminGetResume(req, Promise.resolve({ id: "app-1" }), {
        sessionVerifier: unauthedVerifier,
      });
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated requests to GET /api/admin/enquiries with 401", async () => {
      const req = createJsonRequest();
      const res = await handleAdminGetEnquiries(req, { sessionVerifier: unauthedVerifier });
      expect(res.status).toBe(401);
    });

    it("rejects unauthenticated requests to PATCH /api/admin/enquiries/[id]/status with 401", async () => {
      const req = createJsonRequest({ status: "RESOLVED" });
      const res = await handleAdminUpdateEnquiryStatus(req, Promise.resolve({ id: "enq-1" }), {
        sessionVerifier: unauthedVerifier,
      });
      expect(res.status).toBe(401);
    });
  });

  // =========================================================================
  // 3. JOB MANAGEMENT (LIST ALL, CREATE, EDIT, STATUS, RETENTION GUARD)
  // =========================================================================
  describe("Admin Job Management", () => {
    const existingJob = {
      id: "job-123",
      title: "Senior HR Consultant",
      linkSlug: "senior-hr-consultant",
      department: "Human Resources",
      location: "Bangalore",
      employmentType: "Full-Time",
      experienceLevel: "5+ Years",
      qualification: "MBA in HR",
      desc: "Lead strategic talent search for enterprise clients.",
      overview: "Comprehensive overview of the senior HR role.",
      responsibilities: ["Lead executive search", "Conduct stakeholder meetings"],
      requirements: ["5+ years experience", "Strong network"],
      benefits: ["Health coverage", "Annual bonus"],
      status: "PUBLISHED",
      createdAt: new Date(),
      _count: { applications: 0 },
    };

    it("lists jobs across all statuses including DRAFT and CLOSED", async () => {
      const mockJobs = [
        { ...existingJob, id: "j1", status: "PUBLISHED", _count: { applications: 3 } },
        { ...existingJob, id: "j2", status: "DRAFT", _count: { applications: 0 } },
        { ...existingJob, id: "j3", status: "CLOSED", _count: { applications: 5 } },
      ];

      const mockPrisma = {
        job: {
          findMany: vi.fn().mockResolvedValue(mockJobs),
        },
      };

      const req = createJsonRequest();
      const res = await handleAdminGetJobs(req, {
        prisma: mockPrisma,
        sessionVerifier: authedVerifier,
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.jobs).toHaveLength(3);
      expect(json.jobs.map((j) => j.status)).toEqual(["PUBLISHED", "DRAFT", "CLOSED"]);
    });

    it("creates a job opening with valid payload and unique slug", async () => {
      const mockPrisma = {
        job: {
          findUnique: vi.fn().mockResolvedValue(null), // slug is unique
          create: vi.fn().mockImplementation(async ({ data }) => ({
            id: "job-new-id",
            ...data,
          })),
        },
      };

      const req = createJsonRequest({
        title: "Technical Recruiter",
        linkSlug: "technical-recruiter",
        department: "Talent Acquisition",
        location: "Kochi, Kerala",
        employmentType: "Full-Time",
        experienceLevel: "3-5 Years",
        qualification: "Bachelor's Degree",
        desc: "Sourcing top-tier engineering talent across the region.",
        overview: "Join our expanding technology talent acquisition team.",
        responsibilities: ["Screen resumes", "Conduct intro calls"],
        requirements: ["3+ years technical recruiting experience"],
        benefits: ["Remote work flexibility"],
        status: "DRAFT",
      });

      const res = await handleAdminCreateJob(req, {
        prisma: mockPrisma,
        sessionVerifier: authedVerifier,
      });

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.job.id).toBe("job-new-id");
      expect(json.job.linkSlug).toBe("technical-recruiter");
    });

    it("rejects creating a job when the slug already exists (409 Conflict)", async () => {
      const mockPrisma = {
        job: {
          findUnique: vi.fn().mockResolvedValue(existingJob), // slug already taken
        },
      };

      const req = createJsonRequest({
        title: "Senior HR Consultant Duplicate",
        linkSlug: "senior-hr-consultant",
        department: "Human Resources",
        location: "Bangalore",
        desc: "Short description of the role.",
        overview: "Full overview of the role.",
        responsibilities: ["Task 1"],
        requirements: ["Req 1"],
      });

      const res = await handleAdminCreateJob(req, {
        prisma: mockPrisma,
        sessionVerifier: authedVerifier,
      });

      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("already exists");
    });

    it("rejects creating a job with invalid fields via Zod validation (400)", async () => {
      const mockPrisma = {
        job: {
          findUnique: vi.fn(),
          create: vi.fn(),
        },
      };

      const req = createJsonRequest({
        title: "", // empty title
        linkSlug: "INVALID SLUG WITH SPACES!",
      });

      const res = await handleAdminCreateJob(req, {
        prisma: mockPrisma,
        sessionVerifier: authedVerifier,
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.details).toHaveProperty("title");
    });

    it("updates an existing job and verifies slug conflict with another job", async () => {
      const mockPrisma = {
        job: {
          findUnique: vi.fn().mockImplementation(async ({ where }) => {
            if (where.id === "job-123") return existingJob;
            if (where.linkSlug === "taken-slug") return { id: "job-other", linkSlug: "taken-slug" };
            return null;
          }),
          update: vi.fn().mockImplementation(async ({ data }) => ({
            ...existingJob,
            ...data,
          })),
        },
      };

      // Attempt update to another job's slug
      const reqConflict = createJsonRequest({
        ...existingJob,
        linkSlug: "taken-slug",
      });

      const resConflict = await handleAdminUpdateJob(
        reqConflict,
        Promise.resolve({ id: "job-123" }),
        { prisma: mockPrisma, sessionVerifier: authedVerifier }
      );

      expect(resConflict.status).toBe(409);

      // Successful update
      const reqValid = createJsonRequest({
        ...existingJob,
        title: "Principal HR Consultant",
      });

      const resValid = await handleAdminUpdateJob(
        reqValid,
        Promise.resolve({ id: "job-123" }),
        { prisma: mockPrisma, sessionVerifier: authedVerifier }
      );

      expect(resValid.status).toBe(200);
      const jsonValid = await resValid.json();
      expect(jsonValid.job.title).toBe("Principal HR Consultant");
    });

    it("updates job status between DRAFT, PUBLISHED and CLOSED", async () => {
      const mockPrisma = {
        job: {
          findUnique: vi.fn().mockResolvedValue(existingJob),
          update: vi.fn().mockImplementation(async ({ data }) => ({
            ...existingJob,
            status: data.status,
          })),
        },
      };

      const req = createJsonRequest({ status: "CLOSED" });
      const res = await handleAdminUpdateJobStatus(
        req,
        Promise.resolve({ id: "job-123" }),
        { prisma: mockPrisma, sessionVerifier: authedVerifier }
      );

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.job.status).toBe("CLOSED");
    });

    it("blocks deleting a job if active applications exist (safe retention guard, 409)", async () => {
      const jobWithApps = {
        ...existingJob,
        _count: { applications: 4 }, // Has applicants
      };

      const mockPrisma = {
        job: {
          findUnique: vi.fn().mockResolvedValue(jobWithApps),
          delete: vi.fn(),
        },
      };

      const req = createJsonRequest();
      const res = await handleAdminDeleteJob(
        req,
        Promise.resolve({ id: "job-123" }),
        { prisma: mockPrisma, sessionVerifier: authedVerifier }
      );

      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("active candidate application(s)");
      expect(mockPrisma.job.delete).not.toHaveBeenCalled();
    });

    it("allows deleting a job if it has 0 candidate applications", async () => {
      const jobWithoutApps = {
        ...existingJob,
        _count: { applications: 0 },
      };

      const mockPrisma = {
        job: {
          findUnique: vi.fn().mockResolvedValue(jobWithoutApps),
          delete: vi.fn().mockResolvedValue(jobWithoutApps),
        },
      };

      const req = createJsonRequest();
      const res = await handleAdminDeleteJob(
        req,
        Promise.resolve({ id: "job-123" }),
        { prisma: mockPrisma, sessionVerifier: authedVerifier }
      );

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(mockPrisma.job.delete).toHaveBeenCalledWith({
        where: { id: "job-123" },
      });
    });
  });

  // =========================================================================
  // 4. APPLICATION MANAGEMENT & RESUME STREAMING
  // =========================================================================
  describe("Admin Application Management & Protected Resume Retrieval", () => {
    const mockApplication = {
      id: "app-uuid-1",
      jobId: "job-123",
      applicantName: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 9876543210",
      location: "Kochi, Kerala",
      experience: "4 years in HR recruitment",
      portfolio: "https://linkedin.com/in/rahul-sharma",
      note: "Looking forward to speaking with the team.",
      r2ObjectKey: "resumes/2026-10/app-uuid-1-resume.pdf",
      originalFileName: "rahul_sharma_cv.pdf",
      mimeType: "application/pdf",
      sizeBytes: 1048576,
      status: "NEW",
      createdAt: new Date(),
      job: {
        id: "job-123",
        title: "Senior HR Consultant",
        linkSlug: "senior-hr-consultant",
        department: "Human Resources",
      },
    };

    it("lists applications with optional jobId and status filters", async () => {
      const mockPrisma = {
        jobApplication: {
          findMany: vi.fn().mockResolvedValue([mockApplication]),
        },
      };

      const req = {
        headers: { get: () => null },
        url: "https://example.com/api/admin/applications?jobId=job-123&status=NEW",
      };

      const res = await handleAdminGetApplications(req, {
        prisma: mockPrisma,
        sessionVerifier: authedVerifier,
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.applications).toHaveLength(1);
      expect(mockPrisma.jobApplication.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { jobId: "job-123", status: "NEW" },
        })
      );
    });

    it("updates application status to REVIEWED, SHORTLISTED, or REJECTED", async () => {
      const mockPrisma = {
        jobApplication: {
          findUnique: vi.fn().mockResolvedValue(mockApplication),
          update: vi.fn().mockImplementation(async ({ data }) => ({
            ...mockApplication,
            status: data.status,
          })),
        },
      };

      const req = createJsonRequest({ status: "SHORTLISTED" });
      const res = await handleAdminUpdateApplicationStatus(
        req,
        Promise.resolve({ id: "app-uuid-1" }),
        { prisma: mockPrisma, sessionVerifier: authedVerifier }
      );

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.application.status).toBe("SHORTLISTED");
    });

    it("rejects invalid application status with 400", async () => {
      const req = createJsonRequest({ status: "INVALID_STATUS" });
      const res = await handleAdminUpdateApplicationStatus(
        req,
        Promise.resolve({ id: "app-uuid-1" }),
        { sessionVerifier: authedVerifier }
      );

      expect(res.status).toBe(400);
    });

    it("streams resume securely from private Cloudflare R2 for authenticated admin", async () => {
      const mockPrisma = {
        jobApplication: {
          findUnique: vi.fn().mockResolvedValue(mockApplication),
        },
      };

      const fakePdfStream = Buffer.from("%PDF-1.7 mock resume stream content");
      const mockStreamGetter = vi.fn().mockResolvedValue({
        body: fakePdfStream,
        contentType: "application/pdf",
        contentLength: fakePdfStream.length,
      });

      const req = createJsonRequest();
      const res = await handleAdminGetResume(
        req,
        Promise.resolve({ id: "app-uuid-1" }),
        {
          prisma: mockPrisma,
          sessionVerifier: authedVerifier,
          streamGetter: mockStreamGetter,
        }
      );

      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("application/pdf");
      expect(res.headers.get("Content-Disposition")).toContain('filename="rahul_sharma_cv.pdf"');
      expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(res.headers.get("Cache-Control")).toContain("private");
      expect(mockStreamGetter).toHaveBeenCalledWith("resumes/2026-10/app-uuid-1-resume.pdf");
    });

    it("returns 404 when resume record or file key does not exist", async () => {
      const mockPrisma = {
        jobApplication: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      };

      const req = createJsonRequest();
      const res = await handleAdminGetResume(
        req,
        Promise.resolve({ id: "non-existent" }),
        { prisma: mockPrisma, sessionVerifier: authedVerifier }
      );

      expect(res.status).toBe(404);
    });

    it("rejects unauthenticated application deletion with 401", async () => {
      const unauthVerifier = vi.fn().mockResolvedValue(null);
      const req = createJsonRequest({}, {}, "DELETE");
      const res = await handleAdminDeleteApplication(
        req,
        Promise.resolve({ id: "app-uuid-1" }),
        { sessionVerifier: unauthVerifier }
      );

      expect(res.status).toBe(401);
    });

    it("returns 404 when deleting a non-existent application", async () => {
      const mockPrisma = {
        jobApplication: {
          findUnique: vi.fn().mockResolvedValue(null),
          delete: vi.fn(),
        },
      };

      const req = createJsonRequest({}, {}, "DELETE");
      const res = await handleAdminDeleteApplication(
        req,
        Promise.resolve({ id: "non-existent-app" }),
        { prisma: mockPrisma, sessionVerifier: authedVerifier }
      );

      expect(res.status).toBe(404);
      expect(mockPrisma.jobApplication.delete).not.toHaveBeenCalled();
    });

    it("deletes application from database and removes resume object from Cloudflare R2", async () => {
      const mockPrisma = {
        jobApplication: {
          findUnique: vi.fn().mockResolvedValue(mockApplication),
          delete: vi.fn().mockResolvedValue(mockApplication),
        },
      };
      const mockR2Deleter = vi.fn().mockResolvedValue(undefined);

      const req = createJsonRequest({}, {}, "DELETE");
      const res = await handleAdminDeleteApplication(
        req,
        Promise.resolve({ id: "app-uuid-1" }),
        {
          prisma: mockPrisma,
          sessionVerifier: authedVerifier,
          r2Deleter: mockR2Deleter,
        }
      );

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(mockR2Deleter).toHaveBeenCalledWith("resumes/2026-10/app-uuid-1-resume.pdf");
      expect(mockPrisma.jobApplication.delete).toHaveBeenCalledWith({
        where: { id: "app-uuid-1" },
      });
    });

    it("proceeds with database deletion even if R2 deleter encounters an issue", async () => {
      const mockPrisma = {
        jobApplication: {
          findUnique: vi.fn().mockResolvedValue(mockApplication),
          delete: vi.fn().mockResolvedValue(mockApplication),
        },
      };
      const mockR2Deleter = vi.fn().mockRejectedValue(new Error("R2 Network Timeout"));

      const req = createJsonRequest({}, {}, "DELETE");
      const res = await handleAdminDeleteApplication(
        req,
        Promise.resolve({ id: "app-uuid-1" }),
        {
          prisma: mockPrisma,
          sessionVerifier: authedVerifier,
          r2Deleter: mockR2Deleter,
        }
      );

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(mockPrisma.jobApplication.delete).toHaveBeenCalledWith({
        where: { id: "app-uuid-1" },
      });
    });
  });

  // =========================================================================
  // 5. ENQUIRY MANAGEMENT
  // =========================================================================
  describe("Admin Contact Enquiry Management", () => {
    const mockEnquiry = {
      id: "enq-uuid-1",
      persona: "employer",
      interests: ["Talent Acquisition", "HR Advisory"],
      name: "Deepak Menon",
      email: "deepak@techcorp.in",
      mobile: "+91 9123456789",
      message: "We need 10 senior full stack engineers over next 2 quarters.",
      emailStatus: "SENT",
      status: "NEW",
      createdAt: new Date(),
    };

    it("lists contact enquiries with optional status filter", async () => {
      const mockPrisma = {
        contactEnquiry: {
          findMany: vi.fn().mockResolvedValue([mockEnquiry]),
        },
      };

      const req = {
        headers: { get: () => null },
        url: "https://example.com/api/admin/enquiries?status=NEW",
      };

      const res = await handleAdminGetEnquiries(req, {
        prisma: mockPrisma,
        sessionVerifier: authedVerifier,
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.enquiries).toHaveLength(1);
      expect(mockPrisma.contactEnquiry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "NEW" },
        })
      );
    });

    it("updates enquiry status to READ or RESOLVED", async () => {
      const mockPrisma = {
        contactEnquiry: {
          findUnique: vi.fn().mockResolvedValue(mockEnquiry),
          update: vi.fn().mockImplementation(async ({ data }) => ({
            ...mockEnquiry,
            status: data.status,
          })),
        },
      };

      const req = createJsonRequest({ status: "RESOLVED" });
      const res = await handleAdminUpdateEnquiryStatus(
        req,
        Promise.resolve({ id: "enq-uuid-1" }),
        { prisma: mockPrisma, sessionVerifier: authedVerifier }
      );

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.enquiry.status).toBe("RESOLVED");
    });

    it("rejects invalid enquiry status with 400", async () => {
      const req = createJsonRequest({ status: "DELETED" });
      const res = await handleAdminUpdateEnquiryStatus(
        req,
        Promise.resolve({ id: "enq-uuid-1" }),
        { sessionVerifier: authedVerifier }
      );

      expect(res.status).toBe(400);
    });

    it("deletes a contact enquiry successfully", async () => {
      const mockPrisma = {
        contactEnquiry: {
          findUnique: vi.fn().mockResolvedValue(mockEnquiry),
          delete: vi.fn().mockResolvedValue(mockEnquiry),
        },
      };

      const req = createJsonRequest({}, {}, "DELETE");
      const res = await handleAdminDeleteEnquiry(
        req,
        Promise.resolve({ id: "enq-uuid-1" }),
        { prisma: mockPrisma, sessionVerifier: authedVerifier }
      );

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(mockPrisma.contactEnquiry.delete).toHaveBeenCalledWith({
        where: { id: "enq-uuid-1" },
      });
    });

    it("returns 404 when deleting a non-existent enquiry", async () => {
      const mockPrisma = {
        contactEnquiry: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      };

      const req = createJsonRequest({}, {}, "DELETE");
      const res = await handleAdminDeleteEnquiry(
        req,
        Promise.resolve({ id: "missing-enq" }),
        { prisma: mockPrisma, sessionVerifier: authedVerifier }
      );

      expect(res.status).toBe(404);
    });

    it("automatically purges resolved enquiries older than 3 days", async () => {
      const mockPrisma = {
        contactEnquiry: {
          deleteMany: vi.fn().mockResolvedValue({ count: 5 }),
        },
      };

      const result = await purgeOldResolvedEnquiries(mockPrisma, 3);
      expect(result.count).toBe(5);
      expect(mockPrisma.contactEnquiry.deleteMany).toHaveBeenCalledWith({
        where: {
          status: "RESOLVED",
          updatedAt: { lte: expect.any(Date) },
        },
      });
    });
  });

  // =========================================================================
  // 6. SAME-ORIGIN CSRF DEFENSE VERIFICATION
  // =========================================================================
  describe("Same-Origin CSRF Defense", () => {
    it("permits safe GET requests without origin checks", () => {
      const req = {
        method: "GET",
        headers: { get: () => null },
      };
      const check = verifySameOrigin(req);
      expect(check.allowed).toBe(true);
    });

    it("rejects state-changing requests when Origin header does not match Host (403)", () => {
      const req = {
        method: "POST",
        headers: {
          get: (key) => {
            if (key === "origin") return "https://malicious-attacker.com";
            if (key === "host") return "example.com";
            return null;
          },
        },
      };

      const check = verifySameOrigin(req);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain("Origin mismatch");

      const response = enforceSameOrigin(req);
      expect(response).not.toBeNull();
      expect(response.status).toBe(403);
    });

    it("rejects state-changing requests with sec-fetch-site: cross-site", () => {
      const req = {
        method: "POST",
        headers: {
          get: (key) => {
            if (key === "sec-fetch-site") return "cross-site";
            if (key === "origin") return "https://example.com";
            if (key === "host") return "example.com";
            return null;
          },
        },
      };

      const check = verifySameOrigin(req);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain("browser fetch metadata");
    });

    it("rejects state-changing requests when Origin and Referer are completely missing", () => {
      const req = {
        method: "POST",
        headers: {
          get: (key) => {
            if (key === "host") return "example.com";
            return null;
          },
        },
      };

      const check = verifySameOrigin(req);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain("missing Origin and Referer");
    });

    it("rejects state-changing requests when Origin is malformed", () => {
      const req = {
        method: "POST",
        headers: {
          get: (key) => {
            if (key === "origin") return "not-a-valid-url";
            if (key === "host") return "example.com";
            return null;
          },
        },
      };

      const check = verifySameOrigin(req);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain("Malformed");
    });

    it("allows state-changing requests with matching Host and Origin", () => {
      const req = {
        method: "POST",
        headers: {
          get: (key) => {
            if (key === "origin") return "https://example.com";
            if (key === "host") return "example.com";
            return null;
          },
        },
      };

      const check = verifySameOrigin(req);
      expect(check.allowed).toBe(true);
      expect(enforceSameOrigin(req)).toBeNull();
    });

    it("allows state-changing requests through development tunnels proxying to localhost", () => {
      const req = {
        method: "POST",
        headers: {
          get: (key) => {
            if (key === "origin") return "https://xyz-3000.asse.devtunnels.ms";
            if (key === "host") return "localhost:3000";
            return null;
          },
        },
      };

      const check = verifySameOrigin(req);
      expect(check.allowed).toBe(true);
      expect(enforceSameOrigin(req)).toBeNull();
    });

    it("rejects untrusted third-party origins even when proxying to localhost", () => {
      const req = {
        method: "POST",
        headers: {
          get: (key) => {
            if (key === "origin") return "https://attacker.evil.com";
            if (key === "host") return "localhost:3000";
            return null;
          },
        },
      };

      const check = verifySameOrigin(req);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain("Origin mismatch");
    });

    it("blocks cross-origin request on handleAdminCreateJob with 403", async () => {
      const req = createJsonRequest({}, {
        origin: "https://evil-site.com",
        host: "example.com",
      });

      const res = await handleAdminCreateJob(req, { sessionVerifier: authedVerifier });
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Cross-site state modification rejected");
    });
  });

  // =========================================================================
  // 7. INITIAL ADMIN PROVISIONING & PASSWORD POLICY VERIFICATION
  // =========================================================================
  describe("Admin Provisioning & Password Policy", () => {
    it("rejects passwords under 10 characters", () => {
      const result = validateAdminPassword("Short1!");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("at least 10 characters");
    });

    it("rejects passwords lacking uppercase letters", () => {
      const result = validateAdminPassword("alllowercase12345");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("uppercase letter");
    });

    it("rejects passwords lacking lowercase letters", () => {
      const result = validateAdminPassword("ALLLUPPERCASE12345");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("lowercase letter");
    });

    it("rejects passwords lacking numbers", () => {
      const result = validateAdminPassword("NoNumbersHereAtAll");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("numeric digit");
    });

    it("rejects passwords exceeding bcrypt's 72-byte limit", () => {
      // 75 ASCII characters = 75 bytes
      const longPassword = "A1a" + "x".repeat(72);
      const result = validateAdminPassword(longPassword);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("72-byte limit");
    });

    it("accepts valid passwords meeting complexity and length constraints", () => {
      const result = validateAdminPassword("CorrectHorseBatteryStaple99!");
      expect(result.valid).toBe(true);
    });

    it("prevents silent overwrite of an existing admin account without force=true", async () => {
      const mockPrisma = {
        adminUser: {
          findUnique: vi.fn().mockResolvedValue(mockAdminUser),
          update: vi.fn(),
          create: vi.fn(),
        },
      };

      await expect(
        provisionAdminAccount({
          email: "admin@staffspectrum.com",
          password: "NewPassword123!",
          force: false,
          prismaClient: mockPrisma,
        })
      ).rejects.toThrow('already exists. Pass force=true');

      expect(mockPrisma.adminUser.update).not.toHaveBeenCalled();
    });

    it("allows updating existing admin account when force=true is explicitly set", async () => {
      const mockPrisma = {
        adminUser: {
          findUnique: vi.fn().mockResolvedValue(mockAdminUser),
          update: vi.fn().mockResolvedValue({ ...mockAdminUser, name: "Updated Admin" }),
        },
      };

      const result = await provisionAdminAccount({
        email: "admin@staffspectrum.com",
        password: "NewValidPassword123!",
        name: "Updated Admin",
        force: true,
        prismaClient: mockPrisma,
      });

      expect(result.action).toBe("updated");
      expect(mockPrisma.adminUser.update).toHaveBeenCalled();
    });
  });
});
