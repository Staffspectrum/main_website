import { describe, it, expect, beforeEach, vi } from "vitest";
import { sendContactNotification } from "../../lib/email/contact-mailer";
import { sendApplicationNotification } from "../../lib/email/application-mailer";
import {
  createResumeDownloadToken,
  verifyResumeDownloadToken,
} from "../../lib/security/resume-token";
import { handleAdminGetResume } from "../../app/api/admin/applications/[id]/resume/handler";
import { handleJobApplicationPost } from "../../app/api/jobs/[slug]/apply/route";

describe("Email Notification System & Routing", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.ADMIN_JWT_SECRET = "test_environment_secret_minimum_32_characters_for_admin_jwt";
  });

  // =========================================================================
  // 1. CONTACT FORM CATEGORY ROUTING
  // =========================================================================
  describe("Contact Form Category Routing", () => {
    it("routes 'employer' (Employer / Business) enquiries to info@staff-spectrum.com", async () => {
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "msg-123" });
      const mockTransporter = { sendMail: mockSendMail };

      const result = await sendContactNotification({
        id: "enq-emp-1",
        persona: "employer",
        interests: ["Talent Acquisition"],
        name: "Acme Corp HR",
        email: "hiring@acme.com",
        mobile: "9876543210",
        message: "We need 5 Senior React engineers.",
        createdAt: new Date().toISOString(),
        transporterOverride: mockTransporter,
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe("SENT");
      expect(mockSendMail).toHaveBeenCalledTimes(1);

      const mailOptions = mockSendMail.mock.calls[0][0];
      expect(mailOptions.to).toBe("info@staff-spectrum.com");
      expect(mailOptions.subject).toContain("Employer / Business");
      expect(mailOptions.replyTo).toBe("hiring@acme.com");
    });

    it("routes 'jobseeker' (Job Seeker) enquiries to Hr@staff-spectrum.com", async () => {
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "msg-124" });
      const mockTransporter = { sendMail: mockSendMail };

      const result = await sendContactNotification({
        id: "enq-job-1",
        persona: "jobseeker",
        interests: ["Career Guidance"],
        name: "Rahul Sharma",
        email: "rahul@example.com",
        mobile: "9876543211",
        message: "Looking for HR openings in Kochi.",
        createdAt: new Date().toISOString(),
        transporterOverride: mockTransporter,
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe("SENT");
      expect(mockSendMail).toHaveBeenCalledTimes(1);

      const mailOptions = mockSendMail.mock.calls[0][0];
      expect(mailOptions.to).toBe("Hr@staff-spectrum.com");
      expect(mailOptions.subject).toContain("Job Seeker");
    });

    it("routes 'student' (Student / HR Professional) enquiries to Hr@staff-spectrum.com", async () => {
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "msg-125" });
      const mockTransporter = { sendMail: mockSendMail };

      const result = await sendContactNotification({
        id: "enq-stu-1",
        persona: "student",
        interests: ["CHRMP Certification"],
        name: "Ananya Pillai",
        email: "ananya@example.com",
        mobile: "9876543212",
        message: "Inquiring about syllabus and fee structure.",
        createdAt: new Date().toISOString(),
        transporterOverride: mockTransporter,
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe("SENT");
      expect(mockSendMail).toHaveBeenCalledTimes(1);

      const mailOptions = mockSendMail.mock.calls[0][0];
      expect(mailOptions.to).toBe("Hr@staff-spectrum.com");
      expect(mailOptions.subject).toContain("Student / HR Professional");
    });

    it("returns status SKIPPED when SMTP is not configured without throwing", async () => {
      delete process.env.SMTP_HOST;
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;

      const result = await sendContactNotification({
        id: "enq-no-smtp",
        persona: "employer",
        name: "John",
        email: "john@example.com",
        mobile: "9876543210",
        message: "Hello",
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe("SKIPPED");
      expect(result.error).toContain("SMTP server configuration is not set");
    });
  });

  // =========================================================================
  // 2. JOB APPLICATION EMAIL DISPATCH & DETAILS
  // =========================================================================
  describe("Job Application Email Dispatch", () => {
    const mockApplication = {
      id: "app-test-uuid-101",
      jobId: "job-1",
      applicantName: "Priya Nair",
      email: "priya@example.com",
      phone: "+91 9988776655",
      location: "Bangalore, India",
      experience: "4 years",
      portfolio: "https://linkedin.com/in/priyanair",
      note: "Looking forward to hearing from you.",
      r2ObjectKey: "resumes/priya-uuid-1234.pdf",
      originalFileName: "priya_resume.pdf",
      sizeBytes: 1048576, // 1 MB
      createdAt: new Date().toISOString(),
    };

    const mockJob = {
      id: "job-1",
      title: "Senior HR Specialist",
      department: "Human Resources",
      linkSlug: "senior-hr-specialist",
    };

    it("sends application notification to Hr@staff-spectrum.com with details and secure CV download link", async () => {
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: "msg-app-999" });
      const mockTransporter = { sendMail: mockSendMail };

      const result = await sendApplicationNotification({
        application: mockApplication,
        job: mockJob,
        baseUrl: "https://staff-spectrum.com",
        transporterOverride: mockTransporter,
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe("SENT");
      expect(mockSendMail).toHaveBeenCalledTimes(1);

      const mailOptions = mockSendMail.mock.calls[0][0];
      expect(mailOptions.to).toBe("Hr@staff-spectrum.com");
      expect(mailOptions.subject).toContain("Senior HR Specialist");
      expect(mailOptions.subject).toContain("Priya Nair");
      expect(mailOptions.replyTo).toBe("priya@example.com");

      // Verify content includes applicant details
      expect(mailOptions.text).toContain("Priya Nair");
      expect(mailOptions.text).toContain("priya@example.com");
      expect(mailOptions.text).toContain("+91 9988776655");
      expect(mailOptions.text).toContain("Bangalore, India");
      expect(mailOptions.text).toContain("4 years");
      expect(mailOptions.text).toContain("https://linkedin.com/in/priyanair");
      expect(mailOptions.text).toContain("priya_resume.pdf");

      // Verify secure download link is present and does NOT leak raw R2 key/credentials
      expect(mailOptions.text).toContain("/api/admin/applications/app-test-uuid-101/resume?token=");
      expect(mailOptions.html).toContain("/api/admin/applications/app-test-uuid-101/resume?token=");
      expect(mailOptions.text).not.toContain("staffspectrum-resumes-private");
    });
  });

  // =========================================================================
  // 3. SECURE CV TOKEN & DOWNLOAD AUTHORIZATION
  // =========================================================================
  describe("Secure CV Token Generation & Verification", () => {
    it("generates a signed token that successfully verifies for the corresponding application", async () => {
      const token = await createResumeDownloadToken({
        applicationId: "app-xyz-123",
        r2ObjectKey: "resumes/test-xyz.pdf",
      });

      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(30);

      const payload = await verifyResumeDownloadToken(token, "app-xyz-123");
      expect(payload).not.toBeNull();
      expect(payload.sub).toBe("app-xyz-123");
      expect(payload.scope).toBe("cv_download");
    });

    it("rejects token verification when checked against a different application ID", async () => {
      const token = await createResumeDownloadToken({
        applicationId: "app-correct",
      });

      const payload = await verifyResumeDownloadToken(token, "app-attacker-different");
      expect(payload).toBeNull();
    });

    it("allows downloading CV with a valid signed token on handleAdminGetResume without admin session", async () => {
      const token = await createResumeDownloadToken({
        applicationId: "app-uuid-555",
        r2ObjectKey: "resumes/priya.pdf",
      });

      const mockPrisma = {
        jobApplication: {
          findUnique: vi.fn().mockResolvedValue({
            id: "app-uuid-555",
            originalFileName: "priya.pdf",
            r2ObjectKey: "resumes/priya.pdf",
          }),
        },
      };

      const mockStream = Buffer.from("%PDF-1.7 mock data");
      const mockStreamGetter = vi.fn().mockResolvedValue({
        body: mockStream,
        contentType: "application/pdf",
        contentLength: mockStream.length,
      });

      const unauthedVerifier = vi.fn().mockResolvedValue(null);

      const request = {
        url: `https://staff-spectrum.com/api/admin/applications/app-uuid-555/resume?token=${token}`,
        headers: { get: () => null },
      };

      const res = await handleAdminGetResume(
        request,
        Promise.resolve({ id: "app-uuid-555" }),
        {
          prisma: mockPrisma,
          sessionVerifier: unauthedVerifier,
          streamGetter: mockStreamGetter,
        }
      );

      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("application/pdf");
      expect(mockStreamGetter).toHaveBeenCalledWith("resumes/priya.pdf");
    });

    it("rejects CV download with 401 when token is invalid or missing and no admin session exists", async () => {
      const unauthedVerifier = vi.fn().mockResolvedValue(null);

      const request = {
        url: "https://staff-spectrum.com/api/admin/applications/app-uuid-555/resume?token=invalid.token.here",
        headers: { get: () => null },
      };

      const res = await handleAdminGetResume(
        request,
        Promise.resolve({ id: "app-uuid-555" }),
        {
          sessionVerifier: unauthedVerifier,
        }
      );

      expect(res.status).toBe(401);
    });
  });

  // =========================================================================
  // 4. ERROR ISOLATION: EMAIL FAILURE DOES NOT LOSE SUBMISSIONS
  // =========================================================================
  describe("Email Delivery Isolation (Preserve Data on Email Failure)", () => {
    it("preserves submitted job application in DB and returns 201 when email delivery throws", async () => {
      const validPdfBytes = Buffer.from("%PDF-1.7\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF");
      const fd = new FormData();
      fd.append("name", "Bob Builder");
      fd.append("email", "bob@example.com");
      fd.append("phone", "+91 9123456789");
      const file = new File([validPdfBytes], "bob_cv.pdf", { type: "application/pdf" });
      fd.append("cv", file);

      const mockPrisma = {
        job: {
          findFirst: vi.fn().mockResolvedValue({
            id: "job-hr-1",
            linkSlug: "hr-consultant",
            title: "HR Consultant",
            status: "PUBLISHED",
          }),
        },
        jobApplication: {
          findFirst: vi.fn().mockResolvedValue(null),
          create: vi.fn().mockResolvedValue({
            id: "app-bob-saved-id",
            jobId: "job-hr-1",
            applicantName: "Bob Builder",
            email: "bob@example.com",
            phone: "+91 9123456789",
            r2ObjectKey: "resumes/bob-uuid.pdf",
            originalFileName: "bob_cv.pdf",
            sizeBytes: 100,
            status: "NEW",
            createdAt: new Date(),
          }),
        },
      };

      const mockUploader = vi.fn().mockResolvedValue({
        r2ObjectKey: "resumes/bob-uuid.pdf",
        originalFileName: "bob_cv.pdf",
        sizeBytes: 100,
      });

      const mockDeleter = vi.fn();

      // Mailer deliberately throws an exception (e.g. SMTP server down)
      const failingMailer = vi.fn().mockRejectedValue(new Error("SMTP Connection Timeout"));

      const req = {
        headers: { get: () => null },
        formData: async () => fd,
      };

      const res = await handleJobApplicationPost(
        req,
        Promise.resolve({ slug: "hr-consultant" }),
        {
          prisma: mockPrisma,
          uploader: mockUploader,
          deleter: mockDeleter,
          mailer: failingMailer,
        }
      );

      // Verify HTTP 201 Success returned to applicant
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.id).toBe("app-bob-saved-id");

      // Verify database write succeeded and was NOT reverted
      expect(mockPrisma.jobApplication.create).toHaveBeenCalledTimes(1);

      // Verify R2 rollback deleter was NOT called
      expect(mockDeleter).not.toHaveBeenCalled();

      // Verify mailer was attempted
      expect(failingMailer).toHaveBeenCalledTimes(1);
    });
  });
});
