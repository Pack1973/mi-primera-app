"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Registra un nuevo fichaje (ENTRADA o SALIDA) para el usuario autenticado.
 * El tipo se determina automáticamente según el último fichaje.
 */
export async function fichar() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No autenticado");
  }

  const userId = session.user.id;

  // Buscar el último fichaje del usuario
  const ultimoFichaje = await prisma.fichaje.findFirst({
    where: { userId },
    orderBy: { fecha: "desc" },
  });

  // Determinar el tipo del nuevo fichaje
  // Si no hay fichajes O el último fue SALIDA → ENTRADA
  // Si el último fue ENTRADA → SALIDA
  const tipo =
    !ultimoFichaje || ultimoFichaje.tipo === "SALIDA" ? "ENTRADA" : "SALIDA";

  // Crear el fichaje
  const fichaje = await prisma.fichaje.create({
    data: {
      userId,
      tipo,
    },
  });

  // Refrescar la página para que se vea el nuevo fichaje
  revalidatePath("/");

  return fichaje;
}

/**
 * Obtiene todos los fichajes del día actual del usuario autenticado.
 */
export async function obtenerFichajesHoy() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const userId = session.user.id;

  // Inicio y fin del día actual
  const hoy = new Date();
  const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const finDia = new Date(inicioDia);
  finDia.setDate(finDia.getDate() + 1);

  return await prisma.fichaje.findMany({
    where: {
      userId,
      fecha: {
        gte: inicioDia,
        lt: finDia,
      },
    },
    orderBy: { fecha: "asc" },
  });
}

/**
 * Devuelve si el usuario está actualmente "dentro" (su último fichaje fue ENTRADA).
 */
export async function estaFichado() {
  const session = await auth();

  if (!session?.user?.id) {
    return false;
  }

  const ultimoFichaje = await prisma.fichaje.findFirst({
    where: { userId: session.user.id },
    orderBy: { fecha: "desc" },
  });

  return ultimoFichaje?.tipo === "ENTRADA";
}