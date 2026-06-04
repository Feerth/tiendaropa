import { NextResponse } from "next/server";
import { StockService } from "@/lib/services/stock";
import { stockUpdateSchema } from "@/lib/validations/producto";
import { auth } from "@/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ varianteId: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const { varianteId } = await params;
    const body = await request.json();
    const validation = stockUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Stock inválido", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const variante = await StockService.actualizarStock(varianteId, validation.data.stock);
    return NextResponse.json({ success: true, data: variante });
  } catch (error) {
    console.error("Error en admin/stock/[varianteId]:", error);
    const message = error instanceof Error ? error.message : "Error al actualizar stock";
    return NextResponse.json({ success: false, error: message, code: "UPDATE_ERROR" }, { status: 500 });
  }
}
