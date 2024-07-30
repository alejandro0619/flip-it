"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { AuthError } from "@supabase/supabase-js";
import { LoginSchema, SignupSchema } from "@/schemas/auth";

type AuthResponse<M> = {
  error: string | null;
  payload: M;
};

export async function login(payload: LoginSchema): Promise<AuthResponse<string>> {
  console.log('Intentando iniciar sesión');
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword(payload);
    console.log('Resultado del inicio de sesión', error);

    if (error) {
      throw new Error(error.message);
    } else {
      revalidatePath("/");
      return { error: null, payload: "Bienvenido de nuevo" };
    }
  } catch (e: any) {
    console.log("Error durante el inicio de sesión", e.message);
    return { error: e.message, payload: "Ha ocurrido un error" };
  }
}

export async function signup(formData: SignupSchema): Promise<AuthResponse<string>> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: `${formData.firstName} ${formData.lastName}`,
        },
      }
    });

    if (error) {
      throw new Error(error.message);
    } else {
      return { error: null, payload: "Bienvenido a la plataforma" };
    }
  } catch (e: any) {
    console.error("Error durante el registro", e.message);
    return { error: e.message, payload: "Ha ocurrido un error" };
  }
}
