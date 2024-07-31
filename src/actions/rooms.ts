"use server";
import { CreateRoomSchema } from "@/schemas/rooms";
import { Room, RoomMember } from "@/types";

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
  if (userError) {
    console.error("Error fetching user:", userError);
    return null;
  }

  const { data: roomsData, error } = await supabase
    .from("room")
    .select("room_name, room_description, id, room_members(user_id), owner");

  if (!roomsData || error) {
    console.error("Error fetching rooms:", error);
    return null;
  }

  const roomsPromises = roomsData.map(async (room) => {
    const memberPromises = room.room_members.map(async (user) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, id, email")
        .eq("id", user.user_id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data
        ? { full_name: data.full_name, user_id: data.id, email: data.email }
        : null;
    });

    const members = await Promise.all(memberPromises);
    const filteredMembers = members.filter((member) => member !== null);

    const owner = filteredMembers.find(
      (member) => member.user_id === room.owner
    );
    return {
      ...room,
      room_members:
        filteredMembers.length > 0 ? filteredMembers : ([] as RoomMember[]),
      owner: {
        user_id: room.owner,
        full_name: owner?.full_name || "",
        email: owner?.email || "",
      },
    };
  });

  const rooms = await Promise.all(roomsPromises);

  console.log("rooms", rooms);
  return rooms;
}
export async function getRoomById(id: string): Promise<Room | null> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const { data: rooms, error } = await supabase
    .from("room")
    .select("room_name, room_description, id, room_members(user_id), owner")
    .eq("id", id)
    .single();

  if (!rooms || error || userError) {
    return null;
  }

  const memberPromises = rooms.room_members.map(async (user) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, id, email")
      .eq("id", user.user_id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data
      ? { full_name: data.full_name, user_id: data.id, email: data.email }
      : null;
  });

  const members = await Promise.all(memberPromises);
  const filteredMembers = members.filter((member) => member !== null);

  const room = {
    ...rooms,
    room_members:
      filteredMembers.length > 0 ? filteredMembers : ([] as RoomMember[]),
    owner: {
      user_id: rooms.owner,
      full_name: filteredMembers.find(
        (member) => member.user_id === rooms.owner
      )?.full_name as string,
      email: filteredMembers.find((member) => member.user_id === rooms.owner)
        ?.email as string,
    },
  };

  console.log("room", room);
  return room;
}
