import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { orden: "asc" },
    });

    return NextResponse.json({ success: true, data: categorias });
  } catch (error) {
    console.error("Error en categorias:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener categorías", code: "FETCH_ERROR" },
      { status: 500 }
    );
  }
}
