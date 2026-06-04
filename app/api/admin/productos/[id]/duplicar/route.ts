import { NextResponse } from "next/server";
import { ProductoService } from "@/lib/services/producto";
import { auth } from "@/auth";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const producto = await ProductoService.duplicar(id);
    return NextResponse.json({ success: true, data: producto });
  } catch (error) {
    console.error("Error en admin/productos/[id]/duplicar:", error);
    const message = error instanceof Error ? error.message : "Error al duplicar producto";
    return NextResponse.json({ success: false, error: message, code: "DUPLICATE_ERROR" }, { status: 500 });
  }
}
