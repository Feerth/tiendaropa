import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/store/ProductGrid";
import { FiltersSidebar } from "@/components/store/FiltersSidebar";

export const revalidate = 3600;

interface Props {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<{
    marca?: string;
    talla?: string;
    color?: string;
    precioMin?: string;
    precioMax?: string;
    ordenar?: string;
    page?: string;
  }>;
}

async function getCategoria(slug: string) {
  return prisma.categoria.findUnique({ where: { slug } });
}

async function getMarcas() {
  return prisma.marca.findMany({ orderBy: { nombre: "asc" } });
}

async function getTallas() {
  const variantes = await prisma.variante.findMany({
    select: { talla: true },
    distinct: ["talla"],
    orderBy: { talla: "asc" },
  });
  return variantes.map((v) => v.talla);
}

async function getColores() {
  const variantes = await prisma.variante.findMany({
    where: { color: { not: null } },
    select: { color: true },
    distinct: ["color"],
    orderBy: { color: "asc" },
  });
  return variantes.map((v) => v.color as string);
}

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { categoria: categoriaSlug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page)) || 1;
  const limit = 12;

  const categoria = await getCategoria(categoriaSlug);
  if (!categoria) notFound();

  const where: Record<string, unknown> = { activo: true, categoria: { slug: categoriaSlug } };

  if (sp.talla || sp.color) {
    const varianteFilter: Record<string, unknown> = {};
    if (sp.talla) varianteFilter.talla = sp.talla;
    if (sp.color) varianteFilter.color = sp.color;
    where.variantes = { some: varianteFilter };
  }

  if (sp.marca) {
    where.marca = { slug: sp.marca };
  }

  if (sp.precioMin || sp.precioMax) {
    where.precio = {};
    const precioMin = Number(sp.precioMin);
    const precioMax = Number(sp.precioMax);
    if (sp.precioMin && Number.isFinite(precioMin)) (where.precio as Record<string, unknown>).gte = precioMin;
    if (sp.precioMax && Number.isFinite(precioMax)) (where.precio as Record<string, unknown>).lte = precioMax;
  }

  let orderBy: Record<string, string> = { creadoEn: "desc" };
  if (sp.ordenar === "precio_asc") orderBy = { precio: "asc" };
  if (sp.ordenar === "precio_desc") orderBy = { precio: "desc" };

  const [productos, total, categorias, marcas, tallas, colores] = await Promise.all([
    prisma.producto.findMany({
      where,
      include: {
        categoria: { select: { nombre: true, slug: true } },
        marca: { select: { nombre: true, slug: true } },
        variantes: { select: { talla: true, stock: true, color: true } },
        imagenes: { select: { url: true, colorKey: true }, orderBy: { orden: "asc" } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.producto.count({ where }),
    prisma.categoria.findMany({ orderBy: { orden: "asc" } }),
    getMarcas(),
    getTallas(),
    getColores(),
  ]);

  const productosData = productos.map((p) => ({
    ...p,
    precio: Number(p.precio),
    precioAntes: p.precioAntes ? Number(p.precioAntes) : null,
    imagenes: p.imagenes.map((i) => ({ url: i.url, colorKey: i.colorKey })),
  }));

  const totalPages = Math.ceil(total / limit);

  const construirUrl = (nuevosParams: Record<string, string | null>) => {
    const urlSP = new URLSearchParams();
    const current = {
      marca: sp.marca,
      talla: sp.talla,
      color: sp.color,
      precioMin: sp.precioMin,
      precioMax: sp.precioMax,
      ordenar: sp.ordenar,
      ...nuevosParams,
    };
    for (const [key, val] of Object.entries(current)) {
      if (val) urlSP.set(key, val);
    }
    const qs = urlSP.toString();
    return `/categorias/${categoriaSlug}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/categorias"
            className="text-xs text-text-muted hover:text-accent-primary transition-colors mb-2 inline-block"
          >
            ← TODAS LAS COLECCIONES
          </Link>
          <h1 className="font-display text-5xl md:text-6xl text-text-primary">
            {categoria.nombre.toUpperCase()}
          </h1>
        </div>
        <p className="text-sm text-text-muted">{total} productos</p>
      </div>

      <div className="flex gap-8">
        <Suspense fallback={<div className="hidden lg:block w-64 shrink-0" />}>
          <aside aria-label="Filtros" className="hidden lg:block w-64 shrink-0">
            <FiltersSidebar categorias={categorias} marcas={marcas} tallas={tallas} colores={colores} />
          </aside>
        </Suspense>

        <div className="flex-1 min-w-0">
          <ProductGrid productos={productosData} colorFilter={sp.color} />

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
