import { NextResponse } from "next/server";
import { PedidoService } from "@/lib/services/pedido";
import { pedidoCreateSchema } from "@/lib/validations/checkout.schema";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitize } from "@/lib/sanitize";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed } = await checkRateLimit("pedidos", ip, 10, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Intenta en unos minutos.", code: "RATE_LIMITED" },
        { status: 429 }
      );
    }
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

    const sanitized = {
      ...validation.data,
      nombreCliente: sanitize(validation.data.nombreCliente),
      notas: validation.data.notas ? sanitize(validation.data.notas) : undefined,
    };

    const pedido = await PedidoService.crear(sanitized);

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
