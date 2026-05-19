import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import RelojVivo from "@/components/RelojVivo";
import BotonFichar from "@/components/BotonFichar";
import ListaFichajesHoy from "@/components/ListaFichajesHoy";
import { estaFichado } from "@/actions/fichajes";

export default async function Home() {
  const session = await auth();

  // Si no está logueado, redirige al login
  if (!session?.user) {
    redirect("/login");
  }

  const dentro = await estaFichado();

  return (
    <main
      className={`min-h-screen p-6 transition-colors ${
        dentro
          ? "bg-gradient-to-br from-emerald-600 to-teal-700"
          : "bg-gradient-to-br from-slate-700 to-slate-900"
      }`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header con usuario y logout */}
        <header className="flex items-center justify-between mb-8">
          <div className="text-white">
            <p className="text-sm opacity-80">Sesión iniciada como</p>
            <p className="font-semibold">{session.user.name}</p>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </header>

        {/* Estado y reloj */}
        <div className="text-center mb-8">
          <p className="text-white/80 text-xl mb-2">
            {dentro ? "🟢 Estás trabajando" : "⚪ Estás fuera"}
          </p>
          <RelojVivo />
          <p className="text-white/60 text-sm mt-2">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Botón de fichar */}
        <div className="flex justify-center mb-12">
          <BotonFichar estaDentro={dentro} />
        </div>

        {/* Lista de fichajes de hoy */}
        <ListaFichajesHoy />
      </div>
    </main>
  );
}