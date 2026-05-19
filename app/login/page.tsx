import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">
          App de Fichajes
        </h1>
        <p className="text-slate-500 text-center mb-8">
          Inicia sesión para registrar tu entrada y salida
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("microsoft-entra-id", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 23 23" fill="currentColor">
              <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
            </svg>
            Iniciar sesión con Microsoft
          </button>
        </form>
      </div>
    </main>
  );
}