import { NextResponse } from "next/server";
import { prisma as defaultPrisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/auth/session";
import { purgeOldResolvedEnquiries } from "../../../../lib/data/enquiry-cleanup";

export async function handleAdminGetEnquiries(
  request,
  { prisma = defaultPrisma, sessionVerifier = getAdminSession } = {}
) {
  const session = await sessionVerifier(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }

  try {
    // Automatically delete queries resolved more than 3 days ago
    await purgeOldResolvedEnquiries(prisma, 3);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = {};
    if (status) where.status = status;

    const enquiries = await prisma.contactEnquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (err) {
    console.error("[Admin GET Enquiries Error]:", err?.message);
    return NextResponse.json(
      { success: false, error: "Unable to retrieve enquiries." },
      { status: 500 }
    );
  }
}
