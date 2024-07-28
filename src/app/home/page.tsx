'use client'
import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"
import Avvvatars from "avvvatars-react";

export default async function HomePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  return (
    // <h1>Holaaa bienvenido a mi pagina: {data.user.email}</h1>
    <main className="h-screen w-screen z-10">
    <nav className="fixed z-20 top-0 h-[100px] w-full flex justify-center items-center bg-white shadow-md">
      Bienvenido...
      <Avvvatars
        value={data.user.email || data.user.user_metadata?.name || 'User'} // Fallback a 'User' si no hay email o name
        size={100} // Tamaño del avatar
        radius={50} // Redondez del avatar (50 para circular)
        border={true} // Habilitar borde
        borderColor="#000" // Color del borde
      />
    </nav>
  </main>
  );
}
``;