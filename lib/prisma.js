import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis;

export function getPrismaClient() {
  if (globalForPrisma.__staffspectrum_prisma__) {
    return globalForPrisma.__staffspectrum_prisma__;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // If not set, return null so build-time static generation or unconfigured environments do not crash
    return null;
  }

  // Determine if SSL is required (e.g. DigitalOcean App Platform / Managed Databases)
  const isSsl =
    process.env.DATABASE_SSL === "true" ||
    connectionString.includes("sslmode=require") ||
    connectionString.includes("sslmode=verify-full") ||
    connectionString.includes("ssl=true");

  const poolConfig = {
    connectionString,
    // Keep pool size small to stay within the 1 GB RAM VPS / App Platform memory limit
    max: parseInt(process.env.DB_POOL_MAX || "3", 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };

  if (isSsl) {
    poolConfig.ssl = {
      rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true",
    };
  }

  const pool = new Pool(poolConfig);
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.__staffspectrum_prisma__ = client;
  }

  return client;
}

// Export a proxy object so callers accessing `prisma.job` or `prisma.contactEnquiry`
// always resolve the active client dynamically without stale null references
export const prisma = new Proxy(
  {},
  {
    get(target, prop) {
      const client = getPrismaClient();
      if (!client) {
        return undefined;
      }
      return client[prop];
    },
  }
);

export default prisma;
