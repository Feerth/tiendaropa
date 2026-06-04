import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const pedidos = await prisma.pedido.findMany({
      include: { items: true },
      orderBy: { creadoEn: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: pedidos.map((p) => ({
        ...p,
        total: Number(p.total),
        items: p.items.map((i) => ({ ...i, precioUnit: Number(i.precioUnit) })),
      })),
    });
  } catch (error) {
    console.error("Error en admin/pedidos:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener pedidos", code: "FETCH_ERROR" },
      { status: 500 }
    );
  }
}
