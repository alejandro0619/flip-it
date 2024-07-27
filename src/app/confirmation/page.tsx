import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <main>
      <h1>Gracias por registrarte, revisa el correo electrónico</h1>
      <p>
        Te hemos enviado un correo electrónico para que puedas confirmar tu
        cuenta
      </p>
      <p> ¿Ya lo hiciste? Haz click </p> <Link href='/auth'> acá e inicia sesión</Link>
    </main>
  );
}
