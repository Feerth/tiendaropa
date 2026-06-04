import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;
    const categoria = searchParams.get("categoria");
    const ordenar = searchParams.get("ordenar");

    const where: Record<string, unknown> = { activo: true };

    if (categoria) {
      where.categoria = { slug: categoria };
    }

    let orderBy: Record<string, string> = { creadoEn: "desc" };
    if (ordenar === "precio_asc") orderBy = { precio: "asc" };
    if (ordenar === "precio_desc") orderBy = { precio: "desc" };

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        include: {
          categoria: { select: { nombre: true, slug: true } },
          variantes: { select: { talla: true, stock: true, color: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.producto.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        productos: productos.map((p) => ({
          ...p,
          precio: Number(p.precio),
          precioAntes: p.precioAntes ? Number(p.precioAntes) : null,
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error en productos:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener productos", code: "FETCH_ERROR" },
      { status: 500 }
    );
  }
}
