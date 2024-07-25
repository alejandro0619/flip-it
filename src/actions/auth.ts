"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { AuthError } from "@supabase/supabase-js";
import { LoginSchema, SignupSchema } from "@/schemas/auth";

type AuthResponse<M> = {
  error: string | null;
  payload: M;
};
export async function login(payload: LoginSchema): Promise<AuthResponse<string>> {
  console.log('dsdsdasdasdsadasdasdasdasds')
  try {
    const supabase = await createClient();

    const { error, data } = await supabase.auth.signInWithPassword(payload);
    console.log('nojoda', error, data)
    if (error) {
      throw error;;
    } else {
      revalidatePath("/", "layout");
      return { error: null, payload: "Bienvenido de nuevo" };
    }
  } catch (e: any) {
    console.log("SSDASDSAD", e.message);
    return { error: e.message, payload: "Ha ocurrido un error" };
  }
}

export async function signup(
  formData: SignupSchema
): Promise<AuthResponse<string>> {
  try {
    const supabase = await createClient();

    const { error, data: z } = await supabase.auth.signUp(formData);

    if (error) {
      throw new Error(error.message);
    } else {
      return { error: null, payload: "Bienvenido a la plataforma" };
    }
  } catch (e: any) {
    console.error("SSDASDSAD", e.message);
    return { error: e, payload: "Ha ocurrido un error" };
  }
}

export async function googleAuth(payload: any) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: payload.credential,
  });

  revalidatePath("/", "layout");
  console.log("saasdasd");
  redirect("/home");
}
