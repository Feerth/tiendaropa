import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pedido = await prisma.pedido.findUnique({ where: { id } });
    if (!pedido) {
      return NextResponse.json({ success: false, error: "Pedido no encontrado" }, { status: 404 });
    }
    if (pedido.estadoPago !== "PENDIENTE") {
      return NextResponse.json({ success: false, error: "El pedido no está pendiente de pago" }, { status: 400 });
    }

    await prisma.pedido.update({
      where: { id },
      data: { estadoPago: "EN_REVISION" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al notificar pago";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
