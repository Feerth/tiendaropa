import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { z } from "zod";
import { ConfiguracionService } from "@/lib/services/configuracion";

const updateConfigSchema = z.record(z.string(), z.string().max(500));

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
    const validation = updateConfigSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", code: "VALIDATION_ERROR", details: validation.error.flatten() },
        { status: 400 }
      );
    }
    await ConfiguracionService.actualizar(validation.data);
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("Error en admin/configuracion (PUT):", error);
    return NextResponse.json({ success: false, error: "Error al actualizar configuración", code: "CONFIG_ERROR" }, { status: 500 });
  }
}
