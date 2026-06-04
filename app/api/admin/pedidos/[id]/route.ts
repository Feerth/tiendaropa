import { NextResponse } from "next/server";
import { PedidoService } from "@/lib/services/pedido";
import { pedidoUpdateSchema } from "@/lib/validations/producto";
import { auth } from "@/auth";

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
    const validation = pedidoUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const pedido = await PedidoService.actualizarEstado(id, validation.data);
    return NextResponse.json({ success: true, data: pedido });
  } catch (error) {
    console.error("Error en admin/pedidos/[id]:", error);
    const message = error instanceof Error ? error.message : "Error al actualizar pedido";
    return NextResponse.json({ success: false, error: message, code: "UPDATE_ERROR" }, { status: 500 });
  }
}
