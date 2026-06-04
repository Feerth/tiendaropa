import { prisma } from "@/lib/db";

export const StockService = {
  async obtenerInventario() {
    const variantes = await prisma.variante.findMany({
      include: {
        producto: {
          select: { id: true, nombre: true, slug: true, activo: true },
        },
      },
      orderBy: [
        { producto: { nombre: "asc" } },
        { talla: "asc" },
      ],
    });

    return variantes;
  },

  async actualizarStock(varianteId: string, nuevoStock: number) {
    if (nuevoStock < 0) {
      throw new Error("El stock no puede ser negativo");
    }

    const exists = await prisma.variante.findUnique({
      where: { id: varianteId },
    });

    if (!exists) throw new Error("Variante no encontrada");

    const variante = await prisma.variante.update({
      where: { id: varianteId },
      data: { stock: nuevoStock },
      include: {
        producto: { select: { nombre: true } },
      },
    });

    return variante;
  },

  async verificarStock(varianteId: string, cantidad: number): Promise<boolean> {
    const variante = await prisma.variante.findUnique({
      where: { id: varianteId },
    });

    if (!variante) return false;
    return variante.stock >= cantidad;
  },

  async descontarStock(varianteId: string, cantidad: number) {
    return prisma.$transaction(async (tx) => {
      const variante = await tx.variante.findUnique({
        where: { id: varianteId },
      });

      if (!variante) throw new Error("Variante no encontrada");
      if (variante.stock < cantidad) {
        throw new Error(`Stock insuficiente para la variante ${varianteId}`);
      }

      return tx.variante.update({
        where: { id: varianteId },
        data: { stock: { decrement: cantidad } },
      });
    });
  },

  async alertas() {
    const bajos = await prisma.variante.findMany({
      where: { stock: { lte: 3 } },
      include: {
        producto: { select: { nombre: true } },
      },
      orderBy: { stock: "asc" },
    });

    return bajos.map((v) => ({
      nombre: v.producto.nombre,
      variante: `${v.talla}${v.color ? ` - ${v.color}` : ""}`,
      stock: v.stock,
    }));
  },
};
