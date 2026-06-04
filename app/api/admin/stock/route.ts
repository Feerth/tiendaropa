import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const variantes = await prisma.variante.findMany({
      include: {
        producto: { select: { id: true, nombre: true, slug: true, activo: true } },
      },
      orderBy: [
        { producto: { nombre: "asc" } },
        { talla: "asc" },
      ],
    });

    return NextResponse.json({ success: true, data: variantes });
  } catch (error) {
    console.error("Error en admin/stock:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener inventario", code: "FETCH_ERROR" },
      { status: 500 }
    );
  }
}
