import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { PedidoCreateInput, PedidoUpdateInput } from "@/lib/validations/checkout.schema";

export const PedidoService = {
  async listar(filtros?: { estado?: string }) {
    const where: Prisma.PedidoWhereInput = {};
    if (filtros?.estado) {
      where.estado = filtros.estado as Prisma.EnumEstadoPedidoFilter["equals"];
    }

    const pedidos = await prisma.pedido.findMany({
      where,
      include: { items: true },
      orderBy: { creadoEn: "desc" },
    });

    return pedidos.map((p) => ({
      ...p,
      total: Number(p.total),
      itemsCount: p.items.length,
      items: p.items.map((i) => ({ ...i, precioUnit: Number(i.precioUnit) })),
    }));
  },

  async obtenerPorId(id: string) {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!pedido) return null;

    return {
      ...pedido,
      total: Number(pedido.total),
      items: pedido.items.map((i) => ({
        ...i,
        precioUnit: Number(i.precioUnit),
      })),
    };
  },

  async crear(data: PedidoCreateInput) {
    const varianteIds = data.items.map((i) => i.varianteId);
    const variantes = await prisma.variante.findMany({
      where: { id: { in: varianteIds } },
      include: {
        producto: {
          include: { imagenes: { take: 1, orderBy: { orden: "asc" } } },
        },
      },
    });

    const varianteMap = new Map(variantes.map((v) => [v.id, v]));

    for (const item of data.items) {
      const variante = varianteMap.get(item.varianteId);
      if (!variante) throw new Error(`Variante ${item.varianteId} no encontrada`);
      if (variante.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${variante.producto.nombre} (Talla: ${variante.talla})`);
      }
    }

    const itemsConPrecio = data.items.map((item) => {
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

    const total = itemsConPrecio.reduce(
      (sum, item) => sum + item.precioUnit * item.cantidad,
      0
    );

    const pedido = await prisma.$transaction(async (tx) => {
      const nuevoPedido = await tx.pedido.create({
        data: {
          nombreCliente: data.nombreCliente,
          telefono: data.telefono,
          email: data.email,
          total,
          notas: data.notas,
          items: { create: itemsConPrecio },
        },
        include: { items: true },
      });

      for (const item of data.items) {
        const updated = await tx.variante.update({
          where: { id: item.varianteId },
          data: { stock: { decrement: item.cantidad } },
        });

        if (updated.stock < 0) {
          throw new Error(`Stock insuficiente para variante ${item.varianteId}`);
        }
      }

      return nuevoPedido;
    });

    return {
      ...pedido,
      total: Number(pedido.total),
    };
  },

  async actualizarEstado(id: string, data: PedidoUpdateInput) {
    return prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!pedido) throw new Error("Pedido no encontrado");

      if (data.estado === "CANCELADO" && pedido.estado !== "CANCELADO") {
        for (const item of pedido.items) {
          await tx.variante.update({
            where: { id: item.varianteId },
            data: { stock: { increment: item.cantidad } },
          });
        }
      }

      if (data.estadoPago === "RECHAZADO" && pedido.estadoPago !== "RECHAZADO") {
        for (const item of pedido.items) {
          await tx.variante.update({
            where: { id: item.varianteId },
            data: { stock: { increment: item.cantidad } },
          });
        }
      }

      const updateData: Record<string, unknown> = {};
      if (data.estado) updateData.estado = data.estado;
      if (data.estadoPago) updateData.estadoPago = data.estadoPago;
      if (data.notas !== undefined) updateData.notas = data.notas;

      const updated = await tx.pedido.update({
        where: { id },
        data: updateData,
        include: { items: true },
      });

      return {
        ...updated,
        total: Number(updated.total),
      };
    });
  },

  async dashboard() {
    const hoy = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Lima" })
    );
    hoy.setHours(0, 0, 0, 0);

    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const [totalProductos, productoSinStock, pedidosPendientes, pedidosPagoPendiente, pedidosHoy, ventasHoy, ultimosPedidos, alertas] =
      await Promise.all([
        prisma.producto.count(),
        prisma.producto.count({
          where: { variantes: { none: { stock: { gt: 0 } } } },
        }),
        prisma.pedido.count({
          where: { estado: "PENDIENTE" },
        }),
        prisma.pedido.count({
          where: { estadoPago: "PENDIENTE" },
        }),
        prisma.pedido.count({
          where: { creadoEn: { gte: hoy } },
        }),
        prisma.pedido.aggregate({
          _sum: { total: true },
          where: {
            creadoEn: { gte: hoy },
            estadoPago: "CONFIRMADO",
          },
        }),
        prisma.pedido.findMany({
          include: { items: true },
          orderBy: { creadoEn: "desc" },
          take: 5,
        }),
        prisma.variante.findMany({
          where: { stock: { lte: 3 } },
          include: {
            producto: { select: { nombre: true } },
          },
          orderBy: { stock: "asc" },
        }),
      ]);

    return {
      totalProductos,
      productoSinStock,
      pedidosPendientes,
      pedidosPagoPendiente,
      pedidosHoy,
      ventasHoy: Number(ventasHoy._sum.total) || 0,
      ultimosPedidos: ultimosPedidos.map((p) => ({
        ...p,
        total: Number(p.total),
        itemsCount: p.items.length,
      })),
      alertasStock: alertas.map((a) => ({
        nombre: a.producto.nombre,
        productoId: a.id,
        variante: `${a.talla}${a.color ? ` - ${a.color}` : ""}`,
        stock: a.stock,
      })),
    };
  },
};
