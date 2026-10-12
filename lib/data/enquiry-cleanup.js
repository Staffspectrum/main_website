import { prisma as defaultPrisma } from "../prisma";

export const RESOLVED_PURGE_DAYS = 3;

/**
 * Automatically purges resolved contact enquiries older than the retention threshold (3 days).
 * Returns { count: number } deleted.
 */
export async function purgeOldResolvedEnquiries(
  prisma = defaultPrisma,
  days = RESOLVED_PURGE_DAYS
) {
  if (!prisma?.contactEnquiry?.deleteMany) {
    return { count: 0 };
  }

  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const result = await prisma.contactEnquiry.deleteMany({
      where: {
        status: "RESOLVED",
        updatedAt: { lte: cutoff },
      },
    });

    return { count: result?.count || 0 };
  } catch (err) {
    console.error("[Enquiry Auto-Cleanup] Error purging old resolved enquiries:", err?.message);
    return { count: 0 };
  }
}
