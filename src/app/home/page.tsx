import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"

export default async function HomePage() {

    const supabase = await createClient()

    const {data, error} = await supabase.auth.getUser();
    if(error || !data?.user) {
        redirect('/login')
    }
    return (

        <h1>Holaaa bienvenido a mi pagina: {data.user.email}</h1>
    )
}