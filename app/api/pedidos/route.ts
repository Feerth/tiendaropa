import { NextResponse } from "next/server";
import { PedidoService } from "@/lib/services/pedido";
import { pedidoCreateSchema } from "@/lib/validations/producto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = pedidoCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          code: "VALIDATION_ERROR",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const pedido = await PedidoService.crear(validation.data);

    return NextResponse.json({ success: true, data: pedido }, { status: 201 });
  } catch (error) {
    console.error("Error en pedidos:", error);
    const message = error instanceof Error ? error.message : "Error al crear pedido";
    return NextResponse.json(
      { success: false, error: message, code: "CREATE_ERROR" },
      { status: 500 }
    );
  }
}
