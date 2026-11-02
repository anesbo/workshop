import { z } from 'zod';

export const createRegistrationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  secondName: z.string().trim().min(1, 'Second name is required'),
  email: z.string().trim().email('Invalid email address format').toLowerCase(),
  specialite: z.string().trim().min(1, 'Specialite is required'),
  note: z.string().trim().min(1, 'Note is required'),
});

export const putRegistrationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  secondName: z.string().trim().min(1, 'Second name is required'),
  email: z.string().trim().email('Invalid email address format').toLowerCase(),
  specialite: z.string().trim().min(1, 'Specialite is required'),
  note: z.string().trim().min(1, 'Note is required'),
});

export const patchRegistrationSchema = z
  .object({
    name: z.string().trim().min(1, 'Name cannot be empty').optional(),
    secondName: z.string().trim().min(1, 'Second name cannot be empty').optional(),
    email: z.string().trim().email('Invalid email address format').toLowerCase().optional(),
    specialite: z.string().trim().min(1, 'Specialite cannot be empty').optional(),
    note: z.string().trim().min(1, 'Note cannot be empty').optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: 'At least one field must be provided for partial update',
    }
  );

export const registrationIdParamSchema = z.object({
  id: z.string().uuid('Registration ID must be a valid UUID'),
});

export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>;
export type PutRegistrationInput = z.infer<typeof putRegistrationSchema>;
export type PatchRegistrationInput = z.infer<typeof patchRegistrationSchema>;
