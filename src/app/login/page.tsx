"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginSchema,
  loginSchema,
  SignupSchema,
  signupSchema,
} from "@/schemas/auth";
import { login, signup } from "@/actions/auth";
import { createClient } from "@/utils/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  Input,
  Button,
  FormControl,
  FormLabel,

} from '@chakra-ui/react'

export default function AuthLoginPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showForm, setShowForm] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const redirectTo =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/auth/callback"
      : "https://flip-it-seven.vercel.app/auth/callback";
  const handleFlipClick = () => {
    setIsFlipped(!isFlipped);
  };
  const code = searchParams.get("code") ? searchParams.get('code') : undefined;

  const handleSignInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        
      },
    });
  };

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors, isValid: isLoginValid },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    delayError: 100,
    shouldFocusError: true,
  });

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors, isValid: isSignupValid },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    delayError: 100,
    shouldFocusError: true,
  });

  const onLoginSubmit = async (data: LoginSchema) => {
    const response = await login(data);
    if (response.error) {
      toast.error(
        response.error === "Invalid login credentials"
          ? "Credenciales inválidas"
          : response.error === "Email not confirmed"
          ? "El correo electrónico no ha sido confirmado"
          : "Ha ocurrido un error, intente de nuevo más tarde"
      );
    } else {
      toast.success("Bienvenido de nuevo");
      router.push("/home");
    }
  };

  const onSignupSubmit = async (data: SignupSchema) => {
    const response = await signup(data);
    if (response.error) {
      toast.error(
        response.error === "Email already exists"
          ? "El correo electrónico ya está en uso"
          : "Ha ocurrido un error, intente de nuevo más tarde"
      );
    } else {
      toast.success("Cuenta creada exitosamente");
      router.push("/confirmation");
    }
  };

  return (
    <main className="flex h-screen w-screen ">
      <section className="w-1/2 h-full bg-gradient-to-r from-[#D8B4E2] to-[#BC96E6]  flex items-center justify-center pt-20 relative overflow-hidden">
        {/* Flashcards flotantes */}
        <div className="absolute top-10 left-10 w-[150px] h-[100px] perspective animate-float">
          <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d">
            <div className="absolute w-full h-full backface-hidden bg-[#AE759F] rounded-xl shadow-lg flex items-center justify-center text-white">
              <h1 className="text-6xl font-bold">⚕️</h1>
            </div>
          </div>
        </div>
        <div className="absolute top-20 right-1/4 w-[150px] h-[100px] perspective animate-float">
          <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d">
            <div className="absolute w-full h-full backface-hidden bg-[#D8B4E2] rounded-xl shadow-lg flex items-center justify-center text-white">
              <h1 className="text-6xl font-bold">🎒</h1>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/4 w-[150px] h-[100px] perspective animate-float">
          <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d">
            <div className="absolute w-full h-full backface-hidden bg-[#BC96E6] rounded-xl shadow-lg flex items-center justify-center text-white">
              <h1 className="text-6xl font-bold">💻</h1>
            </div>
          </div>
        </div>
        <div className="absolute bottom-20 right-1/4 w-[150px] h-[100px] perspective animate-float">
          <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d">
            <div className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg flex items-center justify-center text-white">
              <h1 className="text-6xl font-bold">📚</h1>
            </div>
          </div>
        </div>

        {/* Tarjeta principal */}
        <div className="relative w-[500px] h-[400px] perspective">
          <div
            className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-white border border-[#210B2C] rounded-xl shadow-lg">
              <h1
                className="text-5xl font-bold text-gradient cursor-pointer "
                onClick={handleFlipClick}
              >
                Voltea
              </h1>
            </div>
            <div className="absolute w-full h-full rotate-y-180 backface-hidden flex items-center justify-center bg-[#BC96E6] rounded-xl border border-[#210B2C]">
              <h1
                className="text-5xl text-white font-bold cursor-pointer"
                onClick={handleFlipClick}
              >
                Y conquista
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="w-1/2 h-full flex flex-col justify-center items-center dark:bg-custom-dark">
        <h1 className="text-4xl font-extrabold text-custom-dark dark:text-custom-lighter mb-6">
          ¡Hola de nuevo!
        </h1>
        {showForm === "LOGIN" ? (
          <form
            className="flex flex-col border-2 border-[#210B2C] p-6 rounded-xl bg-white shadow-lg w-[350px] max-w-sm space-y-4"
            onSubmit={handleSubmitLogin(onLoginSubmit)}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-[#210B2C]"
              >
                Ingrese su correo
              </label>
              <input
                type="email"
                {...registerLogin("email")}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-customLight"
              />
              {loginErrors.email && (
                <span className="text-red-500">
                  {loginErrors.email.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium text-[#210B2C]"
              >
                Ingrese su contraseña
              </label>
              <input
                type="password"
                {...registerLogin("password")}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-customLight"
              />
              {loginErrors.password && (
                <span className="text-red-500">
                  {loginErrors.password.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-custom-light text-white rounded-lg font-semibold hover:bg-custom-dark transition-colors duration-300 dark:bg-custom-light dark:text-custom-dark dark:hover:bg-custom-light"
              disabled={!isLoginValid}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => setShowForm("SIGNUP")}
              className="w-full px-4 py-2 bg-custom-light text-white rounded-lg font-semibold hover:bg-custom-dark transition-colors duration-300 dark:bg-custom-light dark:text-custom-dark dark:hover:bg-custom-light"
            >
              Crear cuenta
            </button>
            <hr className="border-[#E18AD4] my-4" />
            <button
              type="button"
              onClick={handleSignInWithGoogle}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-[#210B2C] hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <FcGoogle size="25" />
              Iniciar sesión con Google
            </button>
          </form>
        ) : (
          <form
            className="flex flex-col border-2 border-[#210B2C] p-6 rounded-xl bg-white shadow-lg w-[400px] max-w-md space-y-4"
            onSubmit={handleSubmitSignup(onSignupSubmit)}
          >
            {/* Primer nombre */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-lg font-medium text-[#210B2C]"
              >
                Primer nombre
              </label>
              <input
                type="text"
                {...registerSignup("firstName")}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-customLight"
              />
              {signupErrors.firstName && (
                <span className="text-red-500">
                  {signupErrors.firstName.message}
                </span>
              )}
            </div>

            {/* Segundo nombre */}
            <div>
              <label
                htmlFor="secondName"
                className="block text-lg font-medium text-[#210B2C]"
              >
                Segundo nombre
              </label>
              <input
                type="text"
                {...registerSignup("lastName")}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-customLight"
              />
              {signupErrors.lastName && (
                <span className="text-red-500">
                  {signupErrors.lastName.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-[#210B2C]"
              >
                Ingrese su correo
              </label>
              <input
                type="email"
                {...registerSignup("email")}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-customLight"
              />
              {signupErrors.email && (
                <span className="text-red-500">
                  {signupErrors.email.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium text-[#210B2C]"
              >
                Ingrese su contraseña
              </label>
              <input
                type="password"
                {...registerSignup("password")}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-customLight"
              />
              {signupErrors.password && (
                <span className="text-red-500">
                  {signupErrors.password.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-lg font-medium text-[#210B2C]"
              >
                Confirmar contraseña
              </label>
              <input
                type="password"
                {...registerSignup("confirmPassword")}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-customLight"
              />
              {signupErrors.confirmPassword && (
                <span className="text-red-500">
                  {signupErrors.confirmPassword.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-custom-light text-white rounded-lg font-semibold hover:bg-custom-dark transition-colors duration-300 dark:bg-custom-light dark:text-custom-dark dark:hover:bg-custom-light"
              disabled={!isSignupValid}
            >
              Crear cuenta
            </button>
            <button
              type="button"
              onClick={() => setShowForm("LOGIN")}
              className="w-full px-4 py-2 bg-custom-light text-white rounded-lg font-semibold hover:bg-custom-dark transition-colors duration-300 dark:bg-custom-light dark:text-custom-dark dark:hover:bg-custom-light"
            >
              Volver a iniciar sesión
            </button>
            <hr className="border-[#E18AD4] my-4" />
            <button
              type="button"
              onClick={handleSignInWithGoogle}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-[#210B2C] hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <FcGoogle size="25" />
              Iniciar sesión con Google
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
