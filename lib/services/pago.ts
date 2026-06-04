import { prisma } from "@/lib/db";

export const PagoService = {
  async confirmarPago(pedidoId: string, notas?: string) {
    return prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.findUnique({ where: { id: pedidoId } });
      if (!pedido) throw new Error("Pedido no encontrado");
      if (pedido.estadoPago !== "EN_REVISION") {
        throw new Error("El pedido no está en estado de revisión de pago");
      }

      return tx.pedido.update({
        where: { id: pedidoId },
        data: {
          estadoPago: "CONFIRMADO",
          estado: "CONFIRMADO",
          confirmadoEn: new Date(),
          notasAdmin: notas
            ? `${pedido.notasAdmin ? pedido.notasAdmin + "\n" : ""}[CONFIRMAR] ${notas}`
            : pedido.notasAdmin,
        },
        include: { items: true },
      });
    });
  },

  async rechazarPago(pedidoId: string, notas: string) {
    return prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.findUnique({
        where: { id: pedidoId },
        include: { items: true },
      });
      if (!pedido) throw new Error("Pedido no encontrado");
      if (pedido.estadoPago !== "EN_REVISION") {
        throw new Error("El pedido no está en estado de revisión de pago");
      }

      for (const item of pedido.items) {
        await tx.variante.update({
          where: { id: item.varianteId },
          data: { stock: { increment: item.cantidad } },
        });
      }

      return tx.pedido.update({
        where: { id: pedidoId },
        data: {
          estadoPago: "RECHAZADO",
          notasAdmin: `${pedido.notasAdmin ? pedido.notasAdmin + "\n" : ""}[RECHAZAR] ${notas}`,
        },
        include: { items: true },
      });
    });
  },
};
