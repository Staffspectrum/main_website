import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma as defaultPrisma } from "../../../../../lib/prisma";
import {
  createSessionToken,
  getSessionCookieOptions,
} from "../../../../../lib/auth/session";
import {
  checkLoginThrottle,
  recordLoginFailure,
  recordLoginSuccess,
} from "../../../../../lib/security/login-throttle";
import { getClientIp } from "../../../../../lib/security/rate-limit";
import { enforceSameOrigin } from "../../../../../lib/security/csrf";

export async function handleAdminLogin(
  request,
  {
    prisma = defaultPrisma,
    hasher = bcrypt,
    throttler = checkLoginThrottle,
    recordFailure = recordLoginFailure,
    recordSuccess = recordLoginSuccess,
    tokenGenerator = createSessionToken,
    csrfGuard = enforceSameOrigin,
  } = {}
) {
  try {
    // 1. Same-Origin CSRF Verification on login mutation
    if (csrfGuard) {
      const csrfError = csrfGuard(request);
      if (csrfError) return csrfError;
    }

    const clientIp = getClientIp(request);

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const email = (body?.email || "").trim().toLowerCase();
    const password = body?.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    // 2. Dual Throttle Check: Verifies both IP and targeted account identity
    const throttleCheck = throttler({ clientIp, email });

    if (!throttleCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed login attempts. Please wait before trying again.",
          retryAfter: throttleCheck.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(throttleCheck.retryAfter || 60),
          },
        }
      );
    }

    if (!prisma || !prisma.adminUser) {
      return NextResponse.json(
        { success: false, error: "Authentication service is currently unavailable." },
        { status: 500 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      recordFailure({ clientIp, email });
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isMatch = await hasher.compare(password, admin.passwordHash);
    if (!isMatch) {
      recordFailure({ clientIp, email });
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Login succeeded: reset throttle for both IP and account
    recordSuccess({ clientIp, email });

    const token = await tokenGenerator({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const cookieOpts = getSessionCookieOptions();

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: cookieOpts.name,
      value: token,
      httpOnly: cookieOpts.httpOnly,
      secure: cookieOpts.secure,
      sameSite: cookieOpts.sameSite,
      path: cookieOpts.path,
      maxAge: cookieOpts.maxAge,
    });

    return response;
  } catch (error) {
    console.error("[Admin Login Error]:", error?.message);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
