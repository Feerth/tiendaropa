import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/store/ProductGrid";
import { FiltersSidebar } from "@/components/store/FiltersSidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Zapatillas — NOVASK",
  description: "Explora nuestra colección de zapatillas. Estilo urbano con las mejores marcas. Envíos a todo Perú.",
  openGraph: {
    title: "Zapatillas — NOVASK",
    description: "Explora nuestra colección de zapatillas.",
    type: "website",
  },
};

interface Props {
  searchParams: Promise<{
    categoria?: string;
    marca?: string;
    talla?: string;
    color?: string;
    precioMin?: string;
    precioMax?: string;
    enOferta?: string;
    ordenar?: string;
    page?: string;
    buscar?: string;
  }>;
}

async function getCategorias() {
  return prisma.categoria.findMany({ orderBy: { orden: "asc" } });
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

export default async function ProductosPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page)) || 1;
  const currentPage = page;
  const limit = 12;

  const where: Record<string, unknown> = { activo: true };

  if (params.categoria) {
    where.categoria = { slug: params.categoria };
  }

  if (params.marca) {
    where.marca = { slug: params.marca };
  }

  if (params.enOferta === "true") {
    where.precioAntes = { not: null };
  }

  if (params.talla || params.color) {
    const varianteFilter: Record<string, unknown> = {};
    if (params.talla) varianteFilter.talla = params.talla;
    if (params.color) varianteFilter.color = params.color;
    where.variantes = { some: varianteFilter };
  }

  if (params.precioMin || params.precioMax) {
    where.precio = {};
    const precioMin = Number(params.precioMin);
    const precioMax = Number(params.precioMax);
    if (params.precioMin && Number.isFinite(precioMin)) (where.precio as Record<string, unknown>).gte = precioMin;
    if (params.precioMax && Number.isFinite(precioMax)) (where.precio as Record<string, unknown>).lte = precioMax;
  }

  if (params.buscar) {
    where.nombre = { contains: params.buscar, mode: "insensitive" };
  }

  let orderBy: Record<string, string> = { creadoEn: "desc" };
  if (params.ordenar === "precio_asc") orderBy = { precio: "asc" };
  if (params.ordenar === "precio_desc") orderBy = { precio: "desc" };
  if (params.ordenar === "destacados") orderBy = { destacado: "desc" };

  let productos: any[] = [];
  let total = 0;
  let categorias: any[] = [];
  let marcas: any[] = [];
  let tallas: string[] = [];
  let colores: string[] = [];

  try {
    [productos, total, categorias, marcas, tallas, colores] = await Promise.all([
      prisma.producto.findMany({
        where,
        include: {
          categoria: { select: { nombre: true, slug: true } },
          marca: { select: { nombre: true, slug: true } },
          variantes: { select: { talla: true, stock: true, color: true } },
          imagenes: { select: { url: true, colorKey: true }, orderBy: { orden: "asc" } },
        },
        orderBy,
        skip: (currentPage - 1) * limit,
        take: limit,
      }),
      prisma.producto.count({ where }),
      getCategorias(),
      getMarcas(),
      getTallas(),
      getColores(),
    ]);
  } catch (e) {
    console.error("Error loading productos data:", e);
  }

  const productosData = productos.map((p) => ({
    ...p,
    precio: Number(p.precio),
    precioAntes: p.precioAntes ? Number(p.precioAntes) : null,
    imagenes: p.imagenes.map((i) => ({ url: i.url, colorKey: i.colorKey })),
  }));

  const totalPages = Math.ceil(total / limit);

  const construirUrl = (nuevosParams: Record<string, string | null>) => {
    const sp = new URLSearchParams();
    const current = {
      categoria: params.categoria,
      marca: params.marca,
      talla: params.talla,
      color: params.color,
      enOferta: params.enOferta,
      ordenar: params.ordenar,
      precioMin: params.precioMin,
      precioMax: params.precioMax,
      buscar: params.buscar,
      ...nuevosParams,
    };
    for (const [key, val] of Object.entries(current)) {
      if (val) sp.set(key, val);
    }
    return `/productos?${sp.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-5xl md:text-6xl text-text-primary">
          {params.enOferta === "true"
            ? "OFERTAS"
            : params.marca
              ? (marcas.find((m) => m.slug === params.marca)?.nombre.toUpperCase() || "PRODUCTOS")
              : params.categoria
                ? categorias.find((c) => c.slug === params.categoria)?.nombre.toUpperCase() || "PRODUCTOS"
                : "PRODUCTOS"}
        </h1>
        <p className="text-sm text-text-muted">{total} productos</p>
      </div>

      <div className="flex gap-8">
        <Suspense fallback={<div className="hidden lg:block w-64 shrink-0" />}>
          <aside aria-label="Filtros de productos" className="hidden lg:block w-64 shrink-0">
            <FiltersSidebar categorias={categorias} marcas={marcas} tallas={tallas} colores={colores} />
          </aside>
        </Suspense>

        <div className="flex-1 min-w-0">
          <ProductGrid productos={productosData} colorFilter={params.color} />

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
