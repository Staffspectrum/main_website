import { NextResponse } from "next/server";
import { prisma as defaultPrisma } from "../../../lib/prisma";
import { validateContactSubmission } from "../../../lib/validations/contact";
import {
  getClientIp,
  hashClientIp,
  checkRateLimit,
  MAX_BODY_BYTES,
} from "../../../lib/security/rate-limit";
import { sendContactNotification } from "../../../lib/email/contact-mailer";

/**
 * Core handler logic supporting dependency injection for reliable testing
 */
export async function handleContactPost(
  request,
  {
    prisma = defaultPrisma,
    mailer = sendContactNotification,
    rateLimiter = checkRateLimit,
  } = {}
) {
  try {
    // 1. Verify content length header if present
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: "Request payload is too large. Maximum allowed size is 32 KB.",
        },
        { status: 413 }
      );
    }

    // 2. Client IP & Rate Limiting (Abuse Protection)
    const clientIp = getClientIp(request);
    const ipHash = hashClientIp(clientIp);
    const rateCheck = rateLimiter(ipHash);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many submissions from your connection. Please wait a few minutes before trying again.",
          retryAfter: rateCheck.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfter || 60),
          },
        }
      );
    }

    // 3. Parse JSON Body Safely
    let body;
    try {
      const rawText = await request.text();
      if (rawText.length > MAX_BODY_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: "Request payload is too large. Maximum allowed size is 32 KB.",
          },
          { status: 413 }
        );
      }
      body = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON payload.",
        },
        { status: 400 }
      );
    }

    // 4. Server-side Validation with Zod
    const validation = validateContactSubmission(body);
    if (!validation.success) {
      const formattedErrors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please correct the highlighted errors.",
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const { persona, interests, name, email, mobile, message } = validation.data;

    // 5. Database Persistence (Mandatory First Step)
    if (!prisma) {
      console.error("[Contact API] Database client is not configured.");
      return NextResponse.json(
        {
          success: false,
          error:
            "Database service is currently unavailable. Please try again later or reach out directly.",
        },
        { status: 500 }
      );
    }

    let savedEnquiry;
    try {
      savedEnquiry = await prisma.contactEnquiry.create({
        data: {
          persona,
          interests,
          name,
          email,
          mobile,
          message,
          emailStatus: "PENDING",
          clientIpHash: ipHash,
        },
      });
    } catch (dbError) {
      // Log generic safe message without exposing credentials or user PII
      console.error("[Contact API] Database save failed:", dbError?.code || "DB_ERROR");
      return NextResponse.json(
        {
          success: false,
          error:
            "We were unable to save your enquiry at this moment. Please try again shortly.",
        },
        { status: 500 }
      );
    }

    // 6. Asynchronous Email Notification Dispatch
    // Notice: The enquiry is already safely preserved in PostgreSQL!
    try {
      const emailResult = await mailer({
        id: savedEnquiry.id,
        persona,
        interests,
        name,
        email,
        mobile,
        message,
        createdAt: savedEnquiry.createdAt,
      });

      // Update delivery status in DB
      await prisma.contactEnquiry.update({
        where: { id: savedEnquiry.id },
        data: {
          emailStatus: emailResult.status,
          emailError: emailResult.error || null,
        },
      });
    } catch (mailError) {
      // Safe catch: do not fail the request if email update throws
      console.error("[Contact API] Email notification processing error:", mailError?.message);
    }

    // 7. Return Success Response
    return NextResponse.json(
      {
        success: true,
        message: "Thank you for connecting with Staffspectrum. Your enquiry has been received.",
        id: savedEnquiry.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Contact API] Unexpected error in route handler:", error?.message);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return handleContactPost(request);
}
