import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/store/ProductGrid";
import { FiltersSidebar } from "@/components/store/FiltersSidebar";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Productos — ADNSTORE",
  description: "Explora nuestra colección de ropa y zapatillas. Estilo urbano con las mejores marcas. Envíos a todo Perú.",
  openGraph: {
    title: "Productos — ADNSTORE",
    description: "Explora nuestra colección de ropa y zapatillas.",
    type: "website",
  },
};

interface Props {
  searchParams: Promise<{
    categoria?: string;
    talla?: string;
    precioMin?: string;
    precioMax?: string;
    ordenar?: string;
    page?: string;
    buscar?: string;
  }>;
}

async function getCategorias() {
  return prisma.categoria.findMany({ orderBy: { orden: "asc" } });
}

async function getTallas() {
  const variantes = await prisma.variante.findMany({
    select: { talla: true },
    distinct: ["talla"],
    orderBy: { talla: "asc" },
  });
  return variantes.map((v) => v.talla);
}

export default async function ProductosPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 12;

  const where: Record<string, unknown> = { activo: true };

  if (params.categoria) {
    where.categoria = { slug: params.categoria };
  }

  if (params.talla) {
    where.variantes = { some: { talla: params.talla } };
  }

  if (params.precioMin || params.precioMax) {
    where.precio = {};
    if (params.precioMin) (where.precio as Record<string, unknown>).gte = Number(params.precioMin);
    if (params.precioMax) (where.precio as Record<string, unknown>).lte = Number(params.precioMax);
  }

  if (params.buscar) {
    where.nombre = { contains: params.buscar, mode: "insensitive" };
  }

  let orderBy: Record<string, string> = { creadoEn: "desc" };
  if (params.ordenar === "precio_asc") orderBy = { precio: "asc" };
  if (params.ordenar === "precio_desc") orderBy = { precio: "desc" };
  if (params.ordenar === "destacados") orderBy = { destacado: "desc" };

  const [productos, total, categorias, tallas] = await Promise.all([
    prisma.producto.findMany({
      where,
      include: {
        categoria: { select: { nombre: true, slug: true } },
        variantes: { select: { talla: true, stock: true, color: true } },
        imagenes: { select: { url: true }, orderBy: { orden: "asc" } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.producto.count({ where }),
    getCategorias(),
    getTallas(),
  ]);

  const productosData = productos.map((p) => ({
    ...p,
    precio: Number(p.precio),
    precioAntes: p.precioAntes ? Number(p.precioAntes) : null,
    imagenes: p.imagenes.map((i) => i.url),
  }));

  const totalPages = Math.ceil(total / limit);

  const construirUrl = (nuevosParams: Record<string, string | null>) => {
    const sp = new URLSearchParams();
    const current = { categoria: params.categoria, talla: params.talla, ordenar: params.ordenar, ...nuevosParams };
    for (const [key, val] of Object.entries(current)) {
      if (val) sp.set(key, val);
    }
    return `/productos?${sp.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-5xl md:text-6xl text-text-primary">
          {params.categoria
            ? categorias.find((c) => c.slug === params.categoria)?.nombre.toUpperCase() || "PRODUCTOS"
            : "PRODUCTOS"}
        </h1>
        <p className="text-sm text-text-muted">{total} productos</p>
      </div>

      <div className="flex gap-8">
        <Suspense fallback={<div className="hidden lg:block w-64 shrink-0" />}>
          <aside aria-label="Filtros de productos" className="hidden lg:block w-64 shrink-0">
            <FiltersSidebar categorias={categorias} tallas={tallas} />
          </aside>
        </Suspense>

        <div className="flex-1 min-w-0">
          <ProductGrid productos={productosData} />

          {totalPages > 1 && (
            <nav aria-label="Paginación" className="flex items-center justify-center gap-4 mt-12">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Link
                  key={i + 1}
                  href={construirUrl({ page: String(i + 1) })}
                  aria-current={page === i + 1 ? "page" : undefined}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                    page === i + 1
                      ? "bg-accent-primary text-black"
                      : "bg-bg-card text-text-secondary hover:bg-bg-elevated"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
