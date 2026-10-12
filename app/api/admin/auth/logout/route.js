import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "../../../../../lib/auth/session";
import { enforceSameOrigin } from "../../../../../lib/security/csrf";

export async function POST(request, { csrfGuard = enforceSameOrigin } = {}) {
  if (request && csrfGuard) {
    const csrfError = csrfGuard(request);
    if (csrfError) return csrfError;
  }

  const response = NextResponse.json(
    { success: true, message: "Logged out successfully." },
    { status: 200 }
  );

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
