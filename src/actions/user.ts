"use server";

import { createClient } from "@/utils/supabase/server";
import { ServerRes, ProfileDetails } from "@/types";
import {format} from "date-fns";

export async function getUser({
  id,
}: {
  id: string;
}): Promise<ServerRes<ProfileDetails>> {
  try {
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id, email, full_name, created_at, profile_description")
      .eq("id", id)
      .single();

    if (userError) {
      throw userError;
    }
    const { data: groupData, error: groupError } = await supabase
      .from("room_members")
      .select("room_id", { count: "exact" })
      .eq("user_id", id);

    if (groupError) {
      throw groupError;
    }

    return {
      message: "Perfil obtenido",
      payload: {
        email: userData?.email,
        full_name: userData?.full_name,
        id: userData?.id,
        created_at: format(new Date(userData?.created_at), "dd-MM-yyyy"),
        number_of_rooms: groupData ? groupData.length : 0,
        description: userData?.profile_description,
      },
    };
  } catch (error: any) {
    return {
      message: "Error al obtener el perfil",
      error: {
        code: "Ha ocurrido un error mientras se obtenía el perfil",
        err_message: error.message,
      },
    };
  }
}
