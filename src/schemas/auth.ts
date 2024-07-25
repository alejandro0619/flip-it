import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("😥El correo no es válido"),
  password: z
    .string()
    .min(6, "😥La contraseña debe tener al menos 6 caracteres"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.string().email("😥El correo no es válido"),
  password: z
    .string()
    .min(6, "😥La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z
    .string()
    .min(6, "😥La contraseña debe tener al menos 6 caracteres")
}).refine(data => data.password === data.confirmPassword, {
    message: "😥Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

export type SignupSchema = z.infer<typeof signupSchema>;