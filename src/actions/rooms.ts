"use server";
import { CreateRoomSchema } from "@/schemas/rooms";

import { createClient } from "@/utils/supabase/server";

type ServerRes<T> = {
  message: string;
  payload?: T;
  error?: {
    code: string;
    err_message: string;
  };
};
export async function insertRoom(
  payload: CreateRoomSchema
): Promise<ServerRes<string>> {
  try {
    
    const supabase = await createClient();
    const { data, error: userError } = await supabase.auth.getUser();
    const { error, statusText } = await supabase.from("room").insert({
      room_name: payload.name,
      room_description: payload.description,
      owner: data?.user?.id,
    });
    if (!error) {
      return {
        message: statusText,
        payload: "Sala creada satisfactoriamente",
      };
    } else {
      throw new Error("Error al crear la sala");
    }
  } catch (e: any) {
    return {
      message: e.message,
      error: {
        code: e.code,
        err_message: e.message,
      },
    };
  }
}

export async function getRooms() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("room").select("*");
    if (error) {
        throw new Error("Error al obtener las salas");
    }
    return data;
}