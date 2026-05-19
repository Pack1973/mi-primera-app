export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-500 to-purple-600">
      <h1 className="text-6xl font-bold text-white mb-4">
        ¡Hola Mundo! 👋
      </h1>
      <p className="text-2xl text-white">
        Mi primera app desplegada en Vercel
      </p>
      <p className="mt-8 text-lg text-white">
        Fecha: {new Date().toLocaleDateString('es-ES')}
      </p>
    </main>
  );
}