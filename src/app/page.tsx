import ColorModeToggle from "@/components/ColorModeToggle";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen w-screen relative">
        <p>Hola bienvenido, haz login aqui</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          <Link href="/auth">Login</Link>
        </button>
      
      
    </main>
  );
}
