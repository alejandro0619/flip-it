import z from "zod";

export const createRoomSchema = z.object({
  name: z
    .string()
    .min(4, "😥El nombre de la sala debe tener al menos 4 caracteres"),
  description: z
    .string()
    .min(6, "😥La descripción de la sala debe tener al menos 6 caracteres")
    .max(100, "😥La descripción de la sala debe tener menos de 100 caracteres"),
  room_password: z
    .string()
    .min(6, "😥 La contraseña no debe contener menos de 6 caracteres")
    .max(15, "😥 La contraseña no debe contener más de 15 caracteres")
    .optional(),
});
export type CreateRoomSchema = z.infer<typeof createRoomSchema>;

export const joinRoomSchema = z.object({
  room_password: z
    .string()
    .min(6, "😥 La contraseña no debe contener menos de 6 caracteres")
    .max(15, "😥 La contraseña no debe contener más de 15 caracteres"),
});
export type JoinRoomSchema = z.infer<typeof joinRoomSchema>;
