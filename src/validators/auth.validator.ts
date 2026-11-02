import { z } from 'zod';

export const registerAdminSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginAdminSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterAdminInput = z.infer<typeof registerAdminSchema>;
export type LoginAdminInput = z.infer<typeof loginAdminSchema>;
