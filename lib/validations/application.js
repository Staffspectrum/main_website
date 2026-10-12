import { z } from "zod";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const MAX_CV_FILE_SIZE = 10 * 1024 * 1024; // 10 MB strict limit

export const applicationSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name cannot exceed 100 characters."),

  email: z
    .string({ required_error: "Email address is required." })
    .trim()
    .toLowerCase()
    .max(150, "Email cannot exceed 150 characters.")
    .regex(EMAIL_REGEX, "Please enter a valid email address."),

  phone: z
    .string({ required_error: "Phone number is required." })
    .trim()
    .max(25, "Phone number is too long.")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 15;
      },
      {
        message: "Please enter a valid phone number with 10 to 15 digits.",
      }
    ),

  location: z
    .string()
    .trim()
    .max(100, "Location cannot exceed 100 characters.")
    .optional()
    .default(""),

  experience: z
    .string()
    .trim()
    .max(100, "Experience cannot exceed 100 characters.")
    .optional()
    .default(""),

  portfolio: z
    .string()
    .trim()
    .max(255, "Portfolio URL or summary cannot exceed 255 characters.")
    .optional()
    .default(""),

  note: z
    .string()
    .trim()
    .max(2000, "Cover note cannot exceed 2,000 characters.")
    .optional()
    .default(""),
});

/**
 * Validates file buffer, declared MIME type, extension, and PDF signature magic bytes.
 */
export function validateCvFile({ buffer, originalName, mimeType }) {
  if (!buffer || buffer.length === 0) {
    return {
      valid: false,
      error: "Please upload your CV before submitting.",
    };
  }

  // 1. Strict 10 MB size limit
  if (buffer.length > MAX_CV_FILE_SIZE) {
    return {
      valid: false,
      error: "CV file exceeds the 10 MB size limit. Please upload a smaller document.",
    };
  }

  // 2. Validate declared MIME type
  const normalizedMime = (mimeType || "").toLowerCase().trim();
  if (normalizedMime !== "application/pdf") {
    return {
      valid: false,
      error: "Only PDF documents are accepted for CV uploads.",
    };
  }

  // 3. Validate file extension
  const fileName = (originalName || "").toLowerCase().trim();
  if (!fileName.endsWith(".pdf")) {
    return {
      valid: false,
      error: "File must have a .pdf extension.",
    };
  }

  // 4. Validate genuine PDF magic byte signature (%PDF-)
  // In ASCII: % = 0x25, P = 0x50, D = 0x44, F = 0x46, - = 0x2D
  if (buffer.length < 5) {
    return {
      valid: false,
      error: "Uploaded file is corrupted or not a valid PDF document.",
    };
  }

  const header = buffer.slice(0, 5).toString("ascii");
  if (!header.startsWith("%PDF-")) {
    return {
      valid: false,
      error: "The uploaded file does not contain a genuine PDF signature.",
    };
  }

  return {
    valid: true,
  };
}
