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
      <nav className="fixed z-20 top-0 bg-red-100 h-[100px] w-full">
        <Avvvatars
          value={data.user.email || data.user.user_metadata.name}
          size={100}
          borderColor="red"
        />
      </nav>
    </main>
  );
}
``;