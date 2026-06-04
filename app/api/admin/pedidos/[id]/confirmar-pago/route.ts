import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PagoService } from "@/lib/services/pago";

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
    const { accion, notas } = body;

    if (!accion || !["CONFIRMAR", "RECHAZAR"].includes(accion)) {
      return NextResponse.json(
        { success: false, error: "Acción inválida. Usar CONFIRMAR o RECHAZAR", code: "INVALID_ACTION" },
        { status: 400 }
      );
    }

    const pedido = accion === "CONFIRMAR"
      ? await PagoService.confirmarPago(id, notas)
      : await PagoService.rechazarPago(id, notas || "");

    return NextResponse.json({ success: true, data: pedido });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al confirmar pago";
    return NextResponse.json({ success: false, error: message, code: "CONFIRM_ERROR" }, { status: 400 });
  }
}
