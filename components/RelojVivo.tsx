"use client";

import { useEffect, useState } from "react";

export default function RelojVivo() {
  const [hora, setHora] = useState<string>("");

  useEffect(() => {
    // Actualizar inmediatamente
    actualizar();

    // Y cada segundo
    const interval = setInterval(actualizar, 1000);

    return () => clearInterval(interval);
  }, []);

  function actualizar() {
    const ahora = new Date();
    setHora(
      ahora.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  }

  // Mientras no se haya montado en el navegador, mostrar placeholder
  if (!hora) return <div className="text-6xl font-mono text-white">--:--:--</div>;

  return <div className="text-6xl font-mono text-white tracking-wider">{hora}</div>;
}