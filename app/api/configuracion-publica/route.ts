import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const configs = await prisma.configuracion.findMany({
      where: { clave: { in: ["qr_imagen_url", "instagram_usuario"] } },
    });

    const map: Record<string, string | null> = {};
    for (const c of configs) {
      map[c.clave] = c.valor;
    }

    return NextResponse.json({
      success: true,
      data: {
        qr_imagen_url: map.qr_imagen_url ?? null,
        instagram_usuario: map.instagram_usuario ?? null,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al obtener configuración pública" },
      { status: 500 }
    );
  }
}
