import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

const updateCategoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
});

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await _request.json();
    const validation = updateCategoriaSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const categoria = await prisma.categoria.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json({ success: true, data: categoria });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    if (error instanceof Error && "code" in error && (error as { code: string }).code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Ya existe una categoría con ese nombre o slug", code: "DUPLICATE" },
        { status: 409 }
      );
    }
    if (error instanceof Error && "code" in error && (error as { code: string }).code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Categoría no encontrada", code: "NOT_FOUND" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Error al actualizar categoría", code: "UPDATE_ERROR" },
      { status: 500 }
    );
  }
}

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
