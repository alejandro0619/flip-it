import { login } from "@/actions/auth";
import { loginSchema, LoginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

export default function LoginForm({
    setShowForm,
    handleSignInWithGoogle,
    }: {
    setShowForm: (form: "LOGIN" | "SIGNUP") => void;
    handleSignInWithGoogle: () => void
}) {
  
  const router = useRouter();
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
;

  
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
  return (
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
          <span className="text-red-500">{loginErrors.email.message}</span>
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
          <span className="text-red-500">{loginErrors.password.message}</span>
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
  );
}
