import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/store/ProductGrid";
import { HeroSection } from "@/components/store/HeroSection";
import { CategoryGrid } from "@/components/store/CategoryGrid";
import { BrandBar } from "@/components/store/BrandBar";

async function getCategorias() {
  return prisma.categoria.findMany({ orderBy: { orden: "asc" } });
}

async function getMarcas() {
  return prisma.marca.findMany({ where: { activa: true }, orderBy: { nombre: "asc" } });
}

async function getDestacados() {
  let productos = await prisma.producto.findMany({
    where: { activo: true, destacado: true },
    include: {
      categoria: { select: { nombre: true, slug: true } },
      marca: { select: { nombre: true, slug: true } },
      variantes: { select: { id: true, talla: true, stock: true, color: true } },
      imagenes: { select: { url: true, colorKey: true }, orderBy: { orden: "asc" } },
    },
    take: 6,
    orderBy: { creadoEn: "desc" },
  });

  if (productos.length < 4) {
    const ids = productos.map((p) => p.id);
    const fill = await prisma.producto.findMany({
      where: { activo: true, id: { notIn: ids } },
      include: {
        categoria: { select: { nombre: true, slug: true } },
        marca: { select: { nombre: true, slug: true } },
        variantes: { select: { id: true, talla: true, stock: true, color: true } },
        imagenes: { select: { url: true, colorKey: true }, orderBy: { orden: "asc" } },
      },
      take: 4 - productos.length,
      orderBy: { creadoEn: "desc" },
    });
    productos = [...productos, ...fill];
  }

  return productos.map((p) => ({
    ...p,
    precio: Number(p.precio),
    precioAntes: p.precioAntes ? Number(p.precioAntes) : null,
    imagenes: p.imagenes.map((i) => ({ url: i.url, colorKey: i.colorKey })),
  }));
}

async function getNuevos() {
  const productos = await prisma.producto.findMany({
    where: { activo: true },
    include: {
      categoria: { select: { nombre: true, slug: true } },
      marca: { select: { nombre: true, slug: true } },
      variantes: { select: { id: true, talla: true, stock: true, color: true } },
      imagenes: { select: { url: true, colorKey: true }, orderBy: { orden: "asc" } },
    },
    take: 8,
    orderBy: { creadoEn: "desc" },
  });
  return productos.map((p) => ({
    ...p,
    precio: Number(p.precio),
    precioAntes: p.precioAntes ? Number(p.precioAntes) : null,
    imagenes: p.imagenes.map((i) => ({ url: i.url, colorKey: i.colorKey })),
  }));
}

export const metadata: Metadata = {
  title: "NOVASK — Zapatillas Originales",
  description: "Tienda online de zapatillas originales. Estilo urbano con las mejores marcas. Envíos a todo Perú.",
  openGraph: {
    title: "NOVASK — Zapatillas Originales",
    description: "Tienda online de zapatillas originales. Envíos a todo Perú.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [destacados, nuevos, categorias, marcas] = await Promise.all([getDestacados(), getNuevos(), getCategorias(), getMarcas()]);

  return (
    <>
      {/* ─── HERO SECTION ─── */}
      <HeroSection />

      {/* ─── CATEGORY GRID ─── */}
      <CategoryGrid categorias={categorias} />

      {/* ─── MARCAS ─── */}
      <BrandBar marcas={marcas} />

      {/* ─── NUEVOS DROPS ─── */}
      <section className="py-16 md:py-20 px-4 max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="font-display text-6xl md:text-7xl text-text-primary leading-none">
            NUEVOS
            <br className="md:hidden" />
            <span className="text-accent-primary"> DROPS</span>
          </h2>
          <p className="text-text-secondary text-sm md:text-base mt-3 max-w-md">
            Las últimas piezas acaban de llegar. No te quedes sin la tuya.
          </p>
        </div>
        <ProductGrid productos={nuevos} />
      </section>

      {/* ─── EDITORIAL BANNER ─── */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden bg-bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 via-transparent to-accent-primary/5" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 70% 50%, rgba(232,255,0,0.3) 0%, transparent 50%)`,
        }} />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h2 className="font-display text-7xl md:text-9xl text-text-primary leading-none mb-4">
            STYLE<br className="md:hidden" />
            <span className="text-accent-primary">STACK</span>
          </h2>
          <p className="text-text-secondary text-base md:text-lg mb-8 max-w-lg mx-auto">
            Fresh drops. Iconic silhouettes. Piezas que hablan antes que tú.
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary text-black font-bold rounded-lg hover:brightness-110 transition-all duration-200 font-display text-lg tracking-wider"
          >
            EXPLORAR COLECCIÓN
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ─── DESTACADOS ─── */}
      <section className="py-16 md:py-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-5xl md:text-7xl text-text-primary leading-none">
              MÁS
              <br />
              <span className="text-accent-primary">RECOMENDADOS</span>
            </h2>
            <p className="text-text-secondary text-sm md:text-base mt-3">
              Lo más popular de la temporada.
            </p>
          </div>
          <Link
            href="/productos?ordenar=destacados"
            className="hidden md:inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent-primary transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {destacados.slice(0, 4).map((producto, index) => (
            <Link
              key={producto.id}
              href={`/productos/${producto.slug}`}
              className={`group relative rounded-2xl overflow-hidden bg-bg-card border border-[#222] transition-all duration-[250ms] ease-in-out hover:-translate-y-1 hover:border-[rgba(232,255,0,0.35)] ${
                index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
              }`}
            >
              {producto.imagenes[0] ? (
                <img
                  src={producto.imagenes[0].url}
                  alt={producto.nombre}
                  className="w-full h-full object-cover transition-transform duration-[350ms] ease-in-out group-hover:scale-[1.04]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted font-display text-3xl">
                  ADN
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-accent-primary font-medium">
                  {producto.categoria.nombre}
                </span>
                <h3 className="font-display text-lg md:text-2xl text-white mt-1">
                  {producto.nombre}
                </h3>
                <span className="text-xs text-white/70 hover:text-[#E8FF00] transition-colors duration-200 inline-flex items-center gap-1 mt-1">
                  Ver todo →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link
            href="/productos?ordenar=destacados"
            className="inline-flex items-center gap-1 text-sm text-accent-primary hover:underline"
          >
            Ver todos los destacados →
          </Link>
        </div>
      </section>

      {/* ─── TRUST BANNER ─── */}
      <section className="border-y border-border-subtle bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ),
              title: "Pago seguro",
              desc: "Por Yape, Plin o transferencia",
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              ),
              title: "Atención WhatsApp",
              desc: "Respuesta en minutos",
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                </svg>
              ),
              title: "Stock actualizado",
              desc: "En tiempo real",
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
              ),
              title: "Cambios rápidos",
              desc: "Sin complicaciones",
            },
          ].map((item) => (
            <div key={item.title} className="text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary mx-auto md:mx-0 mb-3">
                {item.icon}
              </div>
              <h4 className="text-sm font-medium text-text-primary mb-1">{item.title}</h4>
              <p className="text-xs text-text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
