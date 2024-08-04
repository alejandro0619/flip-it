"use server";
import { CreateRoomSchema } from "@/schemas/rooms";
import { Room, RoomMember } from "@/types";
import { SHA256, AES } from "crypto-js";
import { createClient } from "@/utils/supabase/server";
import { permission } from "process";

type ServerRes<T> = {
  message: string;
  payload?: T;
  error?: {
    code: string;
    err_message: string;
  };
};
/// Insert a member in a room. If it's successful, it will return a message saying "😁 Te has unido a la sala"
/// @param room_id The id of the room
/// @param permission The permission of the user in the room (READ, ADMIN, EDIT) by default is set to READ
export async function insertMemberInRoom(
  room_id: string,
  permission: "READ" | "ADMIN" | "EDIT" = "READ"
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
      permissions: permission,
    });
    console.log("insertionData", insertionData);
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
  payload: CreateRoomSchema & { is_public: boolean }
): Promise<ServerRes<string>> {
  try {
    const supabase = await createClient();
    const { data, error: _userError } = await supabase.auth.getUser();
    const { error, data: insertionData } = await supabase
      .from("room")
      .insert({
        room_name: payload.name,
        room_description: payload.description,
        owner: data?.user?.id,
        is_public: payload.is_public,
        room_password: payload.room_password
          ? SHA256(payload.room_password).toString()
          : null,
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
  const { data: _userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return null;
  }

  const { data: roomsData, error } = await supabase
    .from("room")
    .select(
      "room_name, room_description, id, room_members(user_id), owner, is_public"
    );
    console.log('que molleja', roomsData)
  if (!roomsData || error) {
    console.error("Error fetching rooms:", error);
    return null;
  }
  const rooms_where_user_is_member = roomsData.filter((room) => {
    return room.room_members.some(
      (member) => member.user_id === _userData?.user?.id
    );
  });
  const roomsPromises = rooms_where_user_is_member.map(async (room) => {
    const memberPromises = room.room_members.map(async (user) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, id, email")
        .eq("id", user.user_id)
        .single();

      if (error) {
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
  return rooms;
}
export async function getRoomById(id: string): Promise<Room | null> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const { data: rooms, error } = await supabase
    .from("room")
    .select(
      "room_name, room_description, id, room_members(user_id, permissions), owner, is_public"
    )
    .eq("id", id)
    .single();

  if (!rooms || error || userError) {
    return null;
  }
  const memberPromises: Promise<RoomMember | null>[] = rooms.room_members.map(
    async (user) => {
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
        ? {
            full_name: data.full_name,
            user_id: data.id,
            email: data.email,
            permissions: user.permissions,
          }
        : null;
    }
  );

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
      permission: filteredMembers.find(
        (member) => member.user_id === rooms.owner
      )?.permissions as string,
    },
  };

  return room;
}

export async function joinRoom(
  room_id: string,
  password?: string
): Promise<ServerRes<String>> {
  console.log("verga");
  const supabase = await createClient();
  const { data: _userData, error: userError } = await supabase.auth.getUser();
  console.log(_userData)
  if (userError) {
    console.error("Error fetching user:", userError);
    return {
      message: "Error al unirte a la sala",
      error: {
        code: "UNAUTHORIZED",
        err_message: "Error al unirte a la sala",
      },
    };
  }

  const userId = _userData?.user.id;

  // Check if the user is already a member of the room
  const { data: memberData, error: memberError } = await supabase
    .from("room_members")
    .select("user_id")
    .eq("room_id", room_id)
    .eq("user_id", userId)
    .single();

  if (memberData) {
    return {
      message: "Ya eres miembro de esta sala",
      error: {
        code: "ALREADY_MEMBER",
        err_message: "Ya eres miembro de esta sala",
      },
    };
  }

  const { data: roomData, error } = await supabase
    .from("room")
    .select(
      "room_name, room_description, id, room_members(user_id), owner, is_public, room_password"
    )
    .eq("id", room_id)
    .single();
    console.log(roomData)
  if (!roomData || error) {
    console.error("Error fetching room:", error);
    return {
      message: "Error al unirte a la sala",
      error: {
        code: "ROOM_NOT_FOUND",
        err_message: "Error al unirte a la sala",
      },
    };
  }

  if (roomData.is_public) {
    return insertMemberInRoom(String(room_id));
  }

  if (password && roomData.room_password === SHA256(password).toString()) {
    return insertMemberInRoom(String(room_id));
  }

  return {
    message: "Contraseña incorrecta",
    error: {
      code: "INCORRECT_PASSWORD",
      err_message: "Contraseña incorrecta",
    },
  };
}

