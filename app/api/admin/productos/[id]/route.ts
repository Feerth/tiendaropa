import { NextResponse } from "next/server";
import { ProductoService } from "@/lib/services/producto";
import { updateProductoSchema } from "@/lib/validations/producto";
import { auth } from "@/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateProductoSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", code: "VALIDATION_ERROR", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const producto = await ProductoService.actualizar(id, validation.data);
    return NextResponse.json({ success: true, data: producto });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    const message = error instanceof Error ? error.message : "Error al actualizar producto";
    return NextResponse.json({ success: false, error: message, code: "UPDATE_ERROR" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    if (body.activo !== undefined) {
      const producto = await ProductoService.toggleActivo(id, body.activo);
      return NextResponse.json({ success: true, data: producto });
    }

    const validation = updateProductoSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const producto = await ProductoService.actualizar(id, validation.data);
    return NextResponse.json({ success: true, data: producto });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    const message = error instanceof Error ? error.message : "Error al actualizar producto";
    return NextResponse.json({ success: false, error: message, code: "UPDATE_ERROR" }, { status: 500 });
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
    await ProductoService.eliminar(id);
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    const message = error instanceof Error ? error.message : "Error al eliminar producto";
    return NextResponse.json({ success: false, error: message, code: "DELETE_ERROR" }, { status: 500 });
  }
}
