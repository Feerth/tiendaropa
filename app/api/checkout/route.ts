import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkoutSchema } from "@/lib/validations/checkout.schema";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitize } from "@/lib/sanitize";
import { calcularTotalConPromo } from "@/lib/promo";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, remaining, resetIn } = await rateLimit(ip, 5, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Demasiados pedidos. Intenta de nuevo en unos minutos.",
          code: "RATE_LIMITED",
          retryAfter: Math.ceil(resetIn / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(resetIn / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();
    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.issues.map((i) => ({
        campo: i.path.join("."),
        mensaje: i.message,
      }));
      return NextResponse.json(
        { success: false, error: "Datos inválidos", code: "VALIDATION_ERROR", errors },
        { status: 400 }
      );
    }

    const { nombreCliente, telefono, email, direccion, notas, items } = validation.data;

    const nombreClienteSanitized = sanitize(nombreCliente);
    const direccionSanitized = direccion ? sanitize(direccion) : undefined;
    const notasSanitized = notas ? sanitize(notas) : undefined;

    const varianteIds = items.map((i) => i.varianteId);
    const variantes = await prisma.variante.findMany({
      where: { id: { in: varianteIds } },
      include: {
        producto: {
          include: { imagenes: { take: 1, orderBy: { orden: "asc" } } },
        },
      },
    });

    if (variantes.length !== varianteIds.length) {
      return NextResponse.json(
        { success: false, error: "Algunos productos no existen", code: "NOT_FOUND" },
        { status: 400 }
      );
    }

    const varianteMap = new Map(variantes.map((v) => [v.id, v]));

    for (const item of items) {
      const v = varianteMap.get(item.varianteId)!;
      if (v.stock < item.cantidad) {
        return NextResponse.json(
          {
            success: false,
            error: `Stock insuficiente para ${v.producto.nombre} (Talla: ${v.talla})`,
            code: "INSUFFICIENT_STOCK",
            detalle: { nombre: v.producto.nombre, talla: v.talla, stockDisponible: v.stock },
          },
          { status: 400 }
        );
      }
    }

    const itemsConPrecio = items.map((item) => {
      const v = varianteMap.get(item.varianteId)!;
      return {
        variante: { connect: { id: item.varianteId } },
        cantidad: item.cantidad,
        precioUnit: Number(v.producto.precio),
        nombreProducto: v.producto.nombre,
        talla: v.talla,
        color: v.color,
        sku: v.sku,
        imagenUrl: v.producto.imagenes[0]?.url ?? null,
      };
    });

    const { total } = calcularTotalConPromo(
      itemsConPrecio.map((item) => ({
        precio: item.precioUnit,
        cantidad: item.cantidad,
      }))
    );

    const pedido = await prisma.$transaction(async (tx) => {
      const nuevo = await tx.pedido.create({
        data: {
          nombreCliente: nombreClienteSanitized,
          telefono,
          email: email || null,
          direccion: direccionSanitized || null,
          notas: notasSanitized || null,
          total,
          items: { create: itemsConPrecio },
        },
        include: { items: true },
      });

      for (const item of items) {
        const updated = await tx.variante.update({
          where: { id: item.varianteId },
          data: { stock: { decrement: item.cantidad } },
        });

        if (updated.stock < 0) {
          throw new Error(`Stock insuficiente para variante ${item.varianteId}`);
        }
      }

      return nuevo;
    });

    return NextResponse.json({
      success: true,
      data: {
        id: pedido.id,
        numero: pedido.numero,
        total: Number(pedido.total),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al crear pedido";
    return NextResponse.json(
      { success: false, error: message, code: "CHECKOUT_ERROR" },
      { status: 500 }
    );
  }
}
