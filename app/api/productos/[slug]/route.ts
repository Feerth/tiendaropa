import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const producto = await prisma.producto.findUnique({
      where: { slug, activo: true },
      include: {
        categoria: true,
        marca: true,
        variantes: {
          select: { id: true, talla: true, color: true, stock: true, sku: true },
        },
      },
    });

    if (!producto) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const relacionados = await prisma.producto.findMany({
      where: {
        categoriaId: producto.categoriaId,
        id: { not: producto.id },
        activo: true,
      },
      include: {
        categoria: { select: { nombre: true, slug: true } },
        marca: { select: { nombre: true, slug: true } },
        variantes: { select: { talla: true, stock: true, color: true } },
      },
      take: 4,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...producto,
        precio: Number(producto.precio),
        precioAntes: producto.precioAntes ? Number(producto.precioAntes) : null,
        relacionados: relacionados.map((r) => ({
          ...r,
          precio: Number(r.precio),
          precioAntes: r.precioAntes ? Number(r.precioAntes) : null,
        })),
      },
    });
  } catch (error) {
    console.error("Error en productos/[slug]:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener producto", code: "FETCH_ERROR" },
      { status: 500 }
    );
  }
}
