import { prisma } from "@/lib/db";
import { ProductoForm } from "@/components/admin/ProductoForm";

async function getCategorias() {
  return prisma.categoria.findMany({ orderBy: { orden: "asc" } });
}

async function getMarcas() {
  return prisma.marca.findMany({ orderBy: { nombre: "asc" } });
}

export default async function NuevoProductoPage() {
  const [categorias, marcas] = await Promise.all([getCategorias(), getMarcas()]);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl text-text-primary mb-8">Nuevo Producto</h1>
      <ProductoForm categorias={categorias} marcas={marcas} />
    </div>
  );
}
