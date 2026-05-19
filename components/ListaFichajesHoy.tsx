import { obtenerFichajesHoy } from "@/actions/fichajes";

export default async function ListaFichajesHoy() {
  const fichajes = await obtenerFichajesHoy();

  if (fichajes.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center text-white">
        <p className="text-lg">📭 Aún no has fichado hoy</p>
      </div>
    );
  }

  // Calcular tiempo total trabajado
  let tiempoTotalMs = 0;
  let entradaActual: Date | null = null;

  for (const f of fichajes) {
    if (f.tipo === "ENTRADA") {
      entradaActual = f.fecha;
    } else if (f.tipo === "SALIDA" && entradaActual) {
      tiempoTotalMs += f.fecha.getTime() - entradaActual.getTime();
      entradaActual = null;
    }
  }

  // Si hay una entrada sin salida, sumar hasta ahora
  if (entradaActual) {
    tiempoTotalMs += Date.now() - entradaActual.getTime();
  }

  const horas = Math.floor(tiempoTotalMs / (1000 * 60 * 60));
  const minutos = Math.floor((tiempoTotalMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-white">
      <h3 className="text-xl font-bold mb-4">📋 Fichajes de hoy</h3>

      <div className="space-y-2 mb-4">
        {fichajes.map((f) => (
          <div
            key={f.id}
            className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2"
          >
            <span className="font-semibold">
              {f.tipo === "ENTRADA" ? "🟢 Entrada" : "🔴 Salida"}
            </span>
            <span className="font-mono">
              {f.fecha.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-white/20 pt-3 mt-3 text-center">
        <p className="text-sm opacity-80">Tiempo trabajado hoy</p>
        <p className="text-3xl font-bold font-mono">
          {horas}h {minutos.toString().padStart(2, "0")}m
        </p>
      </div>
    </div>
  );
}