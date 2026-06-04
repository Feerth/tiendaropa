import { prisma } from "@/lib/db";
import { InventarioTable } from "@/components/admin/InventarioTable";

async function getInventario() {
  const variantes = await prisma.variante.findMany({
    include: {
      producto: { select: { id: true, nombre: true, slug: true, activo: true } },
    },
    orderBy: [
      { producto: { nombre: "asc" } },
      { talla: "asc" },
    ],
  });

  return variantes;
}

export default async function InventarioPage() {
  const variantes = await getInventario();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-text-primary">Inventario</h1>
        <p className="text-text-secondary text-sm mt-1">Gestión de stock por variante</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
        <InventarioTable variantes={variantes} />
      </div>
    </div>
  );
}
