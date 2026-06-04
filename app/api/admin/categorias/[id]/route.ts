import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const fallback = await prisma.categoria.findFirst({
      where: { id: { not: id } },
      orderBy: { orden: "asc" },
    });

    if (!fallback) {
      return NextResponse.json(
        { success: false, error: "No se puede eliminar la única categoría. Crea otra primero.", code: "LAST_CATEGORY" },
        { status: 400 }
      );
    }

    await prisma.producto.updateMany({
      where: { categoriaId: id },
      data: { categoriaId: fallback.id },
    });

    await prisma.categoria.delete({ where: { id } });
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar categoría", code: "DELETE_ERROR" },
      { status: 500 }
    );
  }
}
