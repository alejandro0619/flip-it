"use server";
import { CreateRoomSchema } from "@/schemas/rooms";
import { Room } from "@/types";

import { createClient } from "@/utils/supabase/server";

type ServerRes<T> = {
  message: string;
  payload?: T;
  error?: {
    code: string;
    err_message: string;
  };
};
export async function insertMemberInRoom(
  room_id: string
): Promise<ServerRes<String>> {
  try {
    const supabase = await createClient();
    const { data, error: userError } = await supabase.auth.getUser();
    const {
      error,
      statusText,
      data: insertionData,
    } = await supabase.from("room_members").insert({
      user_id: data?.user?.id,
      room_id: room_id,
    });
    if (!error) {
      return {
        message: "😁 Te has unido a la sala",
      };
    }
    throw new Error("Error al unirte a la sala");
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
export async function insertRoom(
  payload: CreateRoomSchema
): Promise<ServerRes<string>> {
  try {
    const supabase = await createClient();
    const { data, error: userError } = await supabase.auth.getUser();
    const { error, data: insertionData } = await supabase
      .from("room")
      .insert({
        room_name: payload.name,
        room_description: payload.description,
        owner: data?.user?.id,
      })
      .select("id");
    console.log("insertionData", insertionData);
    if (!error) {
      return {
        message: "Sala creada satisfactoriamente",
        payload: insertionData?.[0]?.id,
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

export async function getRooms(): Promise<Room[] | null> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const { data: roomsWhereUserBelongs, error } = await supabase
    .from("room_members")
    .select("room_id")
    .eq("user_id", userData?.user?.id);
  if (!roomsWhereUserBelongs) {
    return null;
  }
  const roomIds = roomsWhereUserBelongs?.map(({ room_id }) => room_id) as any[];
  const { data: rooms, error: roomsError } = await supabase
    .from("room")
    .select("room_name, room_description, id, room_members!inner(user_id)")
    .in("id", roomIds);
  if (!rooms) {
    return null;
  }
  console.log(rooms);
  return rooms;
}