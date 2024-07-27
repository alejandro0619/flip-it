import { signup } from "@/actions/auth";
import { signupSchema, SignupSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

export default function SignupForm({
  setShowForm,
  handleSignInWithGoogle,
}: {
  setShowForm: (form: "LOGIN" | "SIGNUP") => void;
  handleSignInWithGoogle: () => void;
}) {
  const router = useRouter();
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
  const onSignupSubmit = async (data: SignupSchema) => {
    const response = await signup(data);
    if (response.error) {
      toast.error(
        response.error === "Email already exists"
          ? "El correo electrónico ya está en uso"
          : response.error === "Database error saving new user"
          ? "No se ha podido crear el usuario"
          : "Ha ocurrido un error, intente de nuevo más tarde"
      );
    } else {
      toast.success("Cuenta creada exitosamente");
      router.replace("/confirmation");
    }
  };
  return (
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
          <span className="text-red-500">{signupErrors.firstName.message}</span>
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
          <span className="text-red-500">{signupErrors.lastName.message}</span>
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
          <span className="text-red-500">{signupErrors.email.message}</span>
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
          <span className="text-red-500">{signupErrors.password.message}</span>
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
  );
}
