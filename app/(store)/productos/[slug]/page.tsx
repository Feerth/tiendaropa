import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProductoService } from "@/lib/services/producto";
import { ProductoDetalleView } from "@/components/store/ProductoDetalleView";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = await prisma.producto.findUnique({
    where: { slug, activo: true },
    select: { nombre: true, descripcion: true, imagenes: { take: 1, orderBy: { orden: "asc" } } },
  });

  if (!producto) return {};

  return {
    title: `${producto.nombre} — NOVASK`,
    description: producto.descripcion || `Compra ${producto.nombre} en NOVASK. Envíos a todo Perú.`,
    openGraph: {
      title: `${producto.nombre} — NOVASK`,
      description: producto.descripcion || undefined,
      images: producto.imagenes[0]?.url ? [{ url: producto.imagenes[0].url }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${producto.nombre} — NOVASK`,
      description: producto.descripcion || undefined,
    },
  };
}

export default async function ProductoDetallePage({ params }: Props) {
  const { slug } = await params;
  const producto = await ProductoService.obtenerPorSlug(slug);

  if (!producto) notFound();

  return <ProductoDetalleView producto={producto} />;
}
