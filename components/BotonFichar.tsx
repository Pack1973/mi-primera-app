"use client";

import { useState, useTransition } from "react";
import { fichar } from "@/actions/fichajes";

interface Props {
  estaDentro: boolean;
}

export default function BotonFichar({ estaDentro }: Props) {
  const [isPending, startTransition] = useTransition();
  const [mensaje, setMensaje] = useState<string | null>(null);

  function handleClick() {
    startTransition(async () => {
      try {
        const fichaje = await fichar();
        const hora = new Date(fichaje.fecha).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setMensaje(`✅ ${fichaje.tipo} registrada a las ${hora}`);

        // Limpiar mensaje a los 3 segundos
        setTimeout(() => setMensaje(null), 3000);
      } catch (error) {
        setMensaje("❌ Error al fichar");
      }
    });
  }

  const colorClass = estaDentro
    ? "bg-red-500 hover:bg-red-600 active:bg-red-700"
    : "bg-green-500 hover:bg-green-600 active:bg-green-700";

  const texto = estaDentro ? "🚪 Fichar SALIDA" : "🚀 Fichar ENTRADA";

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClick}
        disabled={isPending}
        className={`${colorClass} text-white font-bold text-2xl py-6 px-16 rounded-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isPending ? "⏳ Fichando..." : texto}
      </button>

      {mensaje && (
        <div className="bg-white text-slate-800 px-6 py-3 rounded-lg shadow-lg font-semibold">
          {mensaje}
        </div>
      )}
    </div>
  );
}