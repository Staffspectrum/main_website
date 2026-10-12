import { NextResponse } from "next/server";
import { prisma as defaultPrisma } from "../../../../../lib/prisma";
import {
  applicationSchema,
  validateCvFile,
} from "../../../../../lib/validations/application";
import {
  uploadResumeToR2,
  deleteResumeFromR2,
} from "../../../../../lib/storage/r2";
import {
  getClientIp,
  hashClientIp,
} from "../../../../../lib/security/rate-limit";
import { jobsList } from "../../../../careers/jobs-data";
import { sendApplicationNotification } from "../../../../../lib/email/application-mailer";

export async function handleJobApplicationPost(
  request,
  paramsPromise,
  {
    prisma = defaultPrisma,
    uploader = uploadResumeToR2,
    deleter = deleteResumeFromR2,
    mailer = sendApplicationNotification,
  } = {}
) {
  let uploadedR2Key = null;

  try {
    const resolvedParams = await paramsPromise;
    const slug = resolvedParams?.slug;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Invalid job identifier." },
        { status: 400 }
      );
    }

    // 1. Verify Job existence and PUBLISHED status
    let targetJob = null;
    if (prisma && prisma.job) {
      targetJob = await prisma.job.findFirst({
        where: {
          linkSlug: slug,
        },
      });
    } else if (!process.env.DATABASE_URL) {
      targetJob = jobsList.find((j) => j.linkSlug === slug);
      if (targetJob) {
        targetJob = { ...targetJob, id: "static-" + targetJob.linkSlug, status: "PUBLISHED" };
      }
    }

    if (!targetJob) {
      return NextResponse.json(
        { success: false, error: "Job opening not found." },
        { status: 404 }
      );
    }

    if (targetJob.status !== "PUBLISHED") {
      return NextResponse.json(
        {
          success: false,
          error: "This position is currently closed and not accepting applications.",
        },
        { status: 400 }
      );
    }

    // 2. Early Content-Length and Request Body Limits
    // Maximum allowed overall request size: 12 MB (10 MB PDF + 2 MB text/multipart overhead)
    const MAX_MULTIPART_BYTES = 12 * 1024 * 1024;
    const rawContentLength = request.headers?.get?.("content-length");

    if (rawContentLength !== null && rawContentLength !== undefined) {
      const parsedLength = parseInt(rawContentLength, 10);
      if (isNaN(parsedLength) || parsedLength < 0) {
        return NextResponse.json(
          { success: false, error: "Invalid Content-Length header." },
          { status: 400 }
        );
      }
      if (parsedLength > MAX_MULTIPART_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: "Payload exceeds maximum allowed upload size of 10 MB.",
          },
          { status: 413 }
        );
      }
    }

    // 3. Parse Multipart Form Data with Stream Metering Guard
    let formData;
    try {
      // If streaming body is available and not already consumed, meter incoming bytes
      if (
        request.body &&
        typeof request.body.pipeThrough === "function" &&
        typeof TransformStream !== "undefined" &&
        typeof Request !== "undefined"
      ) {
        let totalReceivedBytes = 0;
        const meter = new TransformStream({
          transform(chunk, controller) {
            totalReceivedBytes += chunk?.byteLength || chunk?.length || 0;
            if (totalReceivedBytes > MAX_MULTIPART_BYTES) {
              const err = new Error("PAYLOAD_TOO_LARGE");
              err.name = "PayloadTooLargeError";
              controller.error(err);
              return;
            }
            controller.enqueue(chunk);
          },
        });

        const meteredStream = request.body.pipeThrough(meter);
        const meteredReq = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: meteredStream,
          duplex: "half",
        });
        formData = await meteredReq.formData();
      } else {
        formData = await request.formData();
      }
    } catch (err) {
      if (
        err?.message === "PAYLOAD_TOO_LARGE" ||
        err?.name === "PayloadTooLargeError"
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Payload exceeds maximum allowed upload size of 10 MB.",
          },
          { status: 413 }
        );
      }
      return NextResponse.json(
        { success: false, error: "Invalid or malformed form submission data." },
        { status: 400 }
      );
    }

    // Extract text fields
    const rawData = {
      name: formData.get("name") || "",
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      location: formData.get("location") || "",
      experience: formData.get("experience") || "",
      portfolio: formData.get("portfolio") || "",
      note: formData.get("note") || "",
    };

    // 4. Server-side Validation with Zod
    const validation = applicationSchema.safeParse(rawData);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please correct the highlighted form errors.",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, location, experience, portfolio, note } =
      validation.data;

    // 5. File Extraction, Pre-Buffer Size Check, and Validation
    const file =
      formData.get("cv") ||
      formData.get("cvFile") ||
      formData.get("resume");

    if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        {
          success: false,
          error: "Please upload your CV before submitting.",
          details: { cv: ["CV file is required."] },
        },
        { status: 400 }
      );
    }

    // Pre-buffer size guard: Reject immediately if file.size exceeds 10 MB limit
    // BEFORE invoking file.arrayBuffer() to avoid unnecessary memory allocation on 1 GB VPS
    if (typeof file.size === "number" && file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: "CV file exceeds the 10 MB size limit. Please upload a smaller document.",
          details: { cv: ["CV file exceeds the 10 MB size limit."] },
        },
        { status: 413 }
      );
    }

    // Buffer file once for signature and upload verification
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const fileValidation = validateCvFile({
      buffer: fileBuffer,
      originalName: file.name,
      mimeType: file.type,
    });

    if (!fileValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: fileValidation.error,
          details: { cv: [fileValidation.error] },
        },
        { status: 400 }
      );
    }

    // 5. Duplicate Submission / Rate Limit Protection
    const clientIp = getClientIp(request);
    const ipHash = hashClientIp(clientIp);

    if (prisma && prisma.jobApplication) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentApplication = await prisma.jobApplication.findFirst({
        where: {
          jobId: targetJob.id,
          email,
          createdAt: {
            gte: fiveMinutesAgo,
          },
        },
      });

      if (recentApplication) {
        return NextResponse.json(
          {
            success: false,
            error:
              "An application for this position with this email was recently received. Please allow some time before applying again.",
          },
          { status: 409 }
        );
      }
    }

    // 6. Upload CV to Private Cloudflare R2 Storage
    try {
      const r2Result = await uploader({
        buffer: fileBuffer,
        originalFileName: file.name,
        mimeType: file.type || "application/pdf",
      });
      uploadedR2Key = r2Result.r2ObjectKey;
    } catch (uploadError) {
      console.error("[Job Application] R2 storage upload failed:", uploadError?.message);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to process document storage at this time. Please try again later.",
        },
        { status: 500 }
      );
    }

    // 7. Save Application in PostgreSQL
    let savedApplication;
    try {
      if (!prisma || !prisma.jobApplication) {
        throw new Error("Database client not configured");
      }

      savedApplication = await prisma.jobApplication.create({
        data: {
          jobId: targetJob.id,
          applicantName: name,
          email,
          phone,
          location,
          experience,
          portfolio,
          note,
          r2ObjectKey: uploadedR2Key,
          originalFileName: file.name || "resume.pdf",
          mimeType: "application/pdf",
          sizeBytes: fileBuffer.length,
          status: "NEW",
          clientIpHash: ipHash,
        },
      });
    } catch (dbError) {
      console.error("[Job Application] Database save failed:", dbError?.message);
      // Clean up orphaned R2 object immediately
      if (uploadedR2Key) {
        await deleter(uploadedR2Key);
      }
      return NextResponse.json(
        {
          success: false,
          error: "Unable to record your application at this time. Please try again shortly.",
        },
        { status: 500 }
      );
    }

    // 8. Asynchronous Email Notification Dispatch
    // Notice: Application and CV are already safely saved!
    try {
      await mailer({
        application: savedApplication,
        job: targetJob,
        request,
      });
    } catch (mailError) {
      // Secure logging: do not leak credentials or fail client response
      console.error(
        "[Job Application] Email notification delivery failed:",
        mailError?.message ? mailError.message.slice(0, 200) : "Unknown error"
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your application has been submitted successfully.",
        id: savedApplication.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Job Application] Unexpected server error:", error?.message);
    if (uploadedR2Key) {
      await deleter(uploadedR2Key).catch(() => {});
    }
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  return handleJobApplicationPost(request, params);
}
