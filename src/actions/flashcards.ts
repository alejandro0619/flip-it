'use server'
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function insertFlashCard() {
    try {
        console.log('dadads')
        const supabase = await createClient();
        const {data, error: userError } = await supabase.auth.getUser();
        const { error, statusText } = await supabase.from('flashcards').insert({
            data: {
                "question": 'What is the capital of France?',
                "answer": 'Paris',
                "tags": ['geography', 'europe'],
            },
            user: data.user?.id
        });
        console.log(statusText, error)

    } catch (e: any) {
        console.log("Error during flashcards insertion", e.message);
    }
}