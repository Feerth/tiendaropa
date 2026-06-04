import { NextResponse } from "next/server";
import { PedidoService } from "@/lib/services/pedido";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const data = await PedidoService.dashboard();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error en admin/dashboard:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener dashboard", code: "FETCH_ERROR" },
      { status: 500 }
    );
  }
}
