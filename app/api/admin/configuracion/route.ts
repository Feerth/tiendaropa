import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ConfiguracionService } from "@/lib/services/configuracion";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const data = await ConfiguracionService.obtenerTodas();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Error al obtener configuración", code: "CONFIG_ERROR" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await ConfiguracionService.actualizar(body as Record<string, string>);
    return NextResponse.json({ success: true, data: null });
  } catch {
    return NextResponse.json({ success: false, error: "Error al actualizar configuración", code: "CONFIG_ERROR" }, { status: 500 });
  }
}
