import { auth, signOut } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-slate-800 mb-6 text-center">
          App de Fichajes 🕐
        </h1>

        {session?.user ? (
          <div className="text-center">
            <p className="text-xl text-slate-700 mb-2">
              ¡Hola, <strong>{session.user.name}</strong>! 👋
            </p>
            <p className="text-slate-500 mb-8">{session.user.email}</p>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-slate-600 mb-6">
              No has iniciado sesión todavía.
            </p>
            <Link
              href="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}