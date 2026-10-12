import nodemailer from "nodemailer";

let cachedTransporter = null;

/**
 * Returns a singleton Nodemailer transporter configured via environment variables.
 * Returns null if SMTP configuration is not present.
 */
export function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 8000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  return cachedTransporter;
}

/**
 * Resets cached transporter instance (useful for unit testing with different configs)
 */
export function resetTransporterCache() {
  cachedTransporter = null;
}
