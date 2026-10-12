import { z } from "zod";

const VALID_PERSONAS = ["employer", "jobseeker", "student"];

// Email regex matching standard RFC format
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const contactSchema = z.object({
  persona: z
    .string({ required_error: "Please select your interest category." })
    .refine((val) => VALID_PERSONAS.includes(val), {
      message: "Invalid persona selected. Must be employer, jobseeker, or student.",
    }),

  interests: z
    .array(
      z
        .string()
        .trim()
        .max(100, "Interest tag cannot exceed 100 characters.")
    )
    .max(20, "Too many interests selected.")
    .default([]),

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
    .regex(EMAIL_REGEX, "Please provide a valid email address."),

  mobile: z
    .string({ required_error: "Phone number is required." })
    .trim()
    .max(25, "Phone number is too long.")
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }, {
      message: "Please enter a valid phone number with 10 to 15 digits.",
    }),

  message: z
    .string({ required_error: "Message is required." })
    .trim()
    .min(3, "Message must be at least 3 characters.")
    .max(3000, "Message cannot exceed 3,000 characters."),
});

export function validateContactSubmission(data) {
  return contactSchema.safeParse(data);
}
