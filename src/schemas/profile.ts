import { z } from "zod";

export const userProfileSchema = z.object({
  full_name: z.string().min(1, "El nombre completo es obligatorio"),
  email: z.string().email("Correo electrónico no válido"),
  description: z.string().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;