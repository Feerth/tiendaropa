import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductoForm } from "@/components/admin/ProductoForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params;

  const producto = await prisma.producto.findUnique({
    where: { id },
    include: { variantes: true, imagenes: { orderBy: { orden: "asc" } } },
  });

  if (!producto) notFound();

  const [categorias, marcas] = await Promise.all([
    prisma.categoria.findMany({ orderBy: { orden: "asc" } }),
    prisma.marca.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  const formData = {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion || "",
    precio: Number(producto.precio),
    precioAntes: producto.precioAntes != null ? Number(producto.precioAntes) : undefined,
    categoriaId: producto.categoriaId,
    marcaId: producto.marcaId || undefined,
    imagenes: producto.imagenes.map((i) => ({ url: i.url, colorKey: i.colorKey })),
    destacado: producto.destacado,
    activo: producto.activo,
    variantes: producto.variantes.map((v) => ({
      talla: v.talla,
      color: v.color || "",
      stock: v.stock,
      sku: v.sku || "",
    })),
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl text-text-primary mb-8">Editar: {producto.nombre}</h1>
      <ProductoForm categorias={categorias} marcas={marcas} initialData={formData} />
    </div>
  );
}
