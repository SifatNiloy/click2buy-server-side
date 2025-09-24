import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().optional(),
  password: z.string().min(6).optional()
});

export const updateProfileSchema = z.object({
  displayName: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional()
});
