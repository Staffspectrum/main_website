import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../../lib/auth/session";

export async function GET(request) {
  const session = await getAdminSession(request);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Active admin session required." },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      user: {
        id: session.sub,
        email: session.email,
        name: session.name,
        role: session.role,
      },
    },
    { status: 200 }
  );
}
