import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { updateMarcaSchema } from "@/lib/validations/marca";

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
    const validation = updateMarcaSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const marca = await prisma.marca.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json({ success: true, data: marca });
  } catch (error) {
    console.error("Error al actualizar marca:", error);
    if (error instanceof Error && "code" in error && (error as { code: string }).code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Ya existe una marca con ese nombre o slug", code: "DUPLICATE" },
        { status: 409 }
      );
    }
    if (error instanceof Error && "code" in error && (error as { code: string }).code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Marca no encontrada", code: "NOT_FOUND" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Error al actualizar marca", code: "UPDATE_ERROR" },
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

    await prisma.producto.updateMany({
      where: { marcaId: id },
      data: { marcaId: null },
    });

    await prisma.marca.delete({ where: { id } });
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("Error al eliminar marca:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar marca", code: "DELETE_ERROR" },
      { status: 500 }
    );
  }
}
