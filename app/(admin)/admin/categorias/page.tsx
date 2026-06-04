import { prisma } from "@/lib/db";
import { CategoriasManager } from "@/components/admin/CategoriasManager";

async function getCategorias() {
  return prisma.categoria.findMany({ orderBy: { orden: "asc" } });
}

export default async function CategoriasPage() {
  const categorias = await getCategorias();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-text-primary">Categorías</h1>
        <p className="text-text-secondary text-sm mt-1">Gestiona las categorías de productos</p>
      </div>

      <CategoriasManager categorias={categorias} />
    </div>
  );
}
