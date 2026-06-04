import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/shared/Badge";
import { ProductoDetalleClient } from "@/components/store/ProductoDetalleClient";
import { ProductGrid } from "@/components/store/ProductGrid";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = await prisma.producto.findUnique({
    where: { slug, activo: true },
    select: { nombre: true, descripcion: true, imagenes: { take: 1, orderBy: { orden: "asc" } } },
  });

  if (!producto) return {};

  return {
    title: `${producto.nombre} — ADNSTORE`,
    description: producto.descripcion || `Compra ${producto.nombre} en ADNSTORE. Envíos a todo Perú.`,
    openGraph: {
      title: `${producto.nombre} — ADNSTORE`,
      description: producto.descripcion || undefined,
      images: producto.imagenes[0]?.url ? [{ url: producto.imagenes[0].url }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${producto.nombre} — ADNSTORE`,
      description: producto.descripcion || undefined,
    },
  };
}

async function getProducto(slug: string) {
  const producto = await prisma.producto.findUnique({
    where: { slug, activo: true },
    include: {
      categoria: true,
      variantes: {
        select: { id: true, talla: true, color: true, stock: true, sku: true },
      },
      imagenes: { orderBy: { orden: "asc" } },
    },
  });

  if (!producto) return null;

  const relacionados = await prisma.producto.findMany({
    where: {
      categoriaId: producto.categoriaId,
      id: { not: producto.id },
      activo: true,
    },
    include: {
      categoria: { select: { nombre: true, slug: true } },
      variantes: { select: { talla: true, stock: true, color: true } },
      imagenes: { select: { url: true }, orderBy: { orden: "asc" } },
    },
    take: 4,
  });

  return {
    ...producto,
    precio: Number(producto.precio),
    precioAntes: producto.precioAntes ? Number(producto.precioAntes) : null,
    imagenes: producto.imagenes.map((i) => i.url),
    relacionados: relacionados.map((r) => ({
      ...r,
      precio: Number(r.precio),
      precioAntes: r.precioAntes ? Number(r.precioAntes) : null,
      imagenes: r.imagenes.map((i) => i.url),
    })),
  };
}

export default async function ProductoDetallePage({ params }: Props) {
  const { slug } = await params;
  const producto = await getProducto(slug);

  if (!producto) notFound();

  const totalStock = producto.variantes.reduce((sum, v) => sum + v.stock, 0);
  const isAgotado = totalStock === 0;
  const tieneOferta = !!producto.precioAntes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Galería */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-bg-secondary">
            {producto.imagenes[0] ? (
              <Image
                src={producto.imagenes[0]}
                alt={producto.nombre}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted font-display text-5xl">
                ADNSTORE
              </div>
            )}

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {tieneOferta && <Badge variant="oferta">OFERTA</Badge>}
              {isAgotado && <Badge variant="agotado">AGOTADO</Badge>}
            </div>
          </div>

          {producto.imagenes.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {producto.imagenes.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-bg-secondary">
                  <Image src={img} alt={`${producto.nombre} ${i + 1}`} fill className="object-cover" sizes="100px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-text-muted font-medium uppercase tracking-wider mb-2">
              {producto.categoria.nombre}
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-tight">
              {producto.nombre}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-bold text-accent-primary">
              {formatPrice(producto.precio)}
            </span>
            {tieneOferta && (
              <span className="font-mono text-lg text-text-muted line-through">
                {formatPrice(producto.precioAntes!)}
              </span>
            )}
          </div>

          {!isAgotado && totalStock < 5 && (
            <p className="text-sm text-accent-secondary animate-pulse-stock">
              ⚡ Últimas {totalStock} unidades
            </p>
          )}

          {producto.descripcion && (
            <p className="text-text-secondary leading-relaxed">{producto.descripcion}</p>
          )}

          <ProductoDetalleClient
            productoId={producto.id}
            nombre={producto.nombre}
            imagen={producto.imagenes[0] || ""}
            precio={producto.precio}
            variantes={producto.variantes}
          />

          {/* Productos relacionados */}
          {producto.relacionados.length > 0 && (
            <div className="pt-8 border-t border-border-subtle mt-8">
              <h2 className="font-display text-3xl text-text-primary mb-6">RELACIONADOS</h2>
              <ProductGrid productos={producto.relacionados} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
