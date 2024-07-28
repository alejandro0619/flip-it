import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"
import Avatar from "@/components/Avatar";

export default async function HomePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  return (
    <main className="h-screen w-screen z-10">
    <nav className="fixed z-20 top-0 h-[100px] w-full flex justify-center items-center bg-black shadow-md text-white">
      Bienvenido...
     <Avatar
     placeholder={data.user.email || data.user.user_metadata.name || 'User'}> 

     </Avatar>
    </nav>
  </main>
  );
}
