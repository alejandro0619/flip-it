import Link from "next/link";

export default function Home() {

  return (
    <main>
      Hola bienvenido, haz login aqui

      <button>
        <Link href="/login">Login</Link>
      </button>
    </main>
  );
}
