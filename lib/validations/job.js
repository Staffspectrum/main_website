import { z } from "zod";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const jobSchema = z.object({
  title: z
    .string({ required_error: "Job title is required." })
    .trim()
    .min(2, "Job title must be at least 2 characters.")
    .max(150, "Job title cannot exceed 150 characters."),

  linkSlug: z
    .string({ required_error: "URL slug is required." })
    .trim()
    .toLowerCase()
    .min(2, "URL slug must be at least 2 characters.")
    .max(100, "URL slug cannot exceed 100 characters.")
    .regex(
      SLUG_REGEX,
      "URL slug must be lowercase alphanumeric with hyphens (e.g. senior-hr-manager)."
    ),

  department: z
    .string({ required_error: "Department is required." })
    .trim()
    .min(2, "Department must be at least 2 characters.")
    .max(100, "Department cannot exceed 100 characters."),

  location: z
    .string({ required_error: "Location is required." })
    .trim()
    .min(2, "Location must be at least 2 characters.")
    .max(100, "Location cannot exceed 100 characters."),

  employmentType: z
    .string()
    .trim()
    .max(50)
    .default("Full-Time"),

  experienceLevel: z
    .string()
    .trim()
    .max(50)
    .optional()
    .nullable(),

  qualification: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),

  desc: z
    .string({ required_error: "Brief description is required." })
    .trim()
    .min(10, "Brief description must be at least 10 characters.")
    .max(600, "Brief description cannot exceed 600 characters."),

  overview: z
    .string({ required_error: "Full overview is required." })
    .trim()
    .min(10, "Overview must be at least 10 characters.")
    .max(4000, "Overview cannot exceed 4,000 characters."),

  responsibilities: z
    .array(z.string().trim().max(300))
    .default([]),

  requirements: z
    .array(z.string().trim().max(300))
    .default([]),

  benefits: z
    .array(z.string().trim().max(300))
    .default([]),

  status: z
    .enum(["DRAFT", "PUBLISHED", "CLOSED"], {
      errorMap: () => ({ message: "Status must be DRAFT, PUBLISHED, or CLOSED." }),
    })
    .default("PUBLISHED"),
});
