"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import RightPanel from "@/components/auth/LoginRightPanel";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

export default function AuthLoginPage() {
  const [showForm, setShowForm] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const supabase = createClient();

  const redirectTo =
      "http://localhost:3000/auth/callback"


  const handleSignInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
  };

  return (
    <main className="flex h-screen w-screen ">
      <RightPanel />
      <section className="lg:w-1/2 w-full h-full flex flex-col justify-center items-center dark:bg-custom-dark">

        <h1 className="text-4xl font-extrabold text-custom-dark dark:text-custom-lighter mb-6">
          {`${showForm === 'LOGIN'? '¡Hola de nuevo!' : 'Bienvenido a Flip It!'}`}
        </h1>
        {showForm === "LOGIN" ? (
          <LoginForm
            setShowForm={setShowForm}
            handleSignInWithGoogle={handleSignInWithGoogle}
          />
        ) : (
          <SignupForm
            setShowForm={setShowForm}
            handleSignInWithGoogle={handleSignInWithGoogle}
          />
        )}
      </section>
    </main>
  );
}
