import { prisma } from "@/lib/db";
import { MarcasManager } from "@/components/admin/MarcasManager";

async function getMarcas() {
  return prisma.marca.findMany({ orderBy: { nombre: "asc" } });
}

export default async function MarcasPage() {
  const marcas = await getMarcas();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-text-primary">Marcas</h1>
        <p className="text-text-secondary text-sm mt-1">Gestiona las marcas de productos</p>
      </div>

      <MarcasManager marcas={marcas} />
    </div>
  );
}
