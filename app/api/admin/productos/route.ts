import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ProductoService } from "@/lib/services/producto";
import { createProductoSchema } from "@/lib/validations/producto";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const productos = await prisma.producto.findMany({
      include: {
        categoria: { select: { nombre: true } },
        marca: { select: { nombre: true } },
        variantes: { select: { stock: true } },
        imagenes: { select: { url: true, colorKey: true }, orderBy: { orden: "asc" } },
      },
      orderBy: { creadoEn: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: productos.map((p) => ({
        ...p,
        precio: Number(p.precio),
        stockTotal: p.variantes.reduce((sum, v) => sum + v.stock, 0),
      })),
    });
  } catch (error) {
    console.error("Error en admin/productos (GET):", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener productos", code: "FETCH_ERROR" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = createProductoSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", code: "VALIDATION_ERROR", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const producto = await ProductoService.crear(validation.data);
    return NextResponse.json({ success: true, data: producto }, { status: 201 });
  } catch (error) {
    console.error("Error en admin/productos (POST):", error);
    const message = error instanceof Error ? error.message : "Error al crear producto";
    return NextResponse.json({ success: false, error: message, code: "CREATE_ERROR" }, { status: 500 });
  }
}
