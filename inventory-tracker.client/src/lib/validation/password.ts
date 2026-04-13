import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long")
  .refine((val) => /[A-Z]/.test(val), "Must contain at least one uppercase letter")
  .refine((val) => /[a-z]/.test(val), "Must contain at least one lowercase letter")
  .refine((val) => /[0-9]/.test(val), "Must contain at least one number")
  .refine((val) => /[!@#$%^&*]/.test(val), "Must contain at least one special character");
