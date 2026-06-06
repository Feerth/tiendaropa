import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Colecciones — NOVASK",
  description: "Explora nuestras colecciones de zapatillas por estilo. Encuentra tu próximo par.",
  openGraph: {
    title: "Colecciones — NOVASK",
    description: "Explora nuestras colecciones de zapatillas por estilo.",
    type: "website",
  },
};

async function getCategorias() {
  return prisma.categoria.findMany({
    where: { activa: true },
    orderBy: { orden: "asc" },
  });
}

const GRADIENTS = [
  "linear-gradient(135deg, #1a1a2e, #16213e)",
  "linear-gradient(135deg, #1a0a0a, #2d1b1b)",
  "linear-gradient(135deg, #0a1a0a, #1b2d1b)",
  "linear-gradient(135deg, #1a1500, #2d2600)",
];

function SneakerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 16l2-6h12l2 2-1 4H2z" />
      <path d="M4 10V8a4 4 0 018 0v2" />
      <path d="M16 12l3 1v3" />
    </svg>
  );
}

export default async function CategoriasPage() {
  const categorias = await getCategorias();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="font-display text-6xl md:text-7xl text-text-primary leading-none">
          COLECCIONES
        </h1>
        <p className="text-text-secondary text-sm md:text-base mt-3 max-w-md">
          Explora por estilo y encuentra el par perfecto para ti.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categorias.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-text-muted">No hay colecciones disponibles.</p>
          </div>
        ) : (
          categorias.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/productos?categoria=${cat.slug}`}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-[#222] transition-all duration-[250ms] ease-in-out hover:-translate-y-1 hover:border-[rgba(232,255,0,0.35)]"
            >
              {cat.imagenUrl ? (
                <div className="absolute inset-0">
                  <img
                    src={cat.imagenUrl}
                    alt={cat.nombre}
                    className="w-full h-full object-cover transition-transform duration-[350ms] ease-in-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              ) : (
                <div
                  className="absolute inset-0 transition-transform duration-[350ms] ease-in-out group-hover:scale-[1.04]"
                  style={{ background: GRADIENTS[index % GRADIENTS.length] }}
                />
              )}

              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              }} />

              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
                <span className="font-display text-[60px] md:text-[100px] text-white/5 leading-none -rotate-12 whitespace-nowrap">
                  {cat.nombre.toUpperCase()}
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8FF00] scale-x-0 origin-left transition-transform duration-[250ms] ease-in-out group-hover:scale-x-100 z-10" />

              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                <div className="mb-2 text-accent-primary/80 group-hover:text-accent-primary transition-colors duration-200">
                  <SneakerIcon />
                </div>
                <h3 className="font-display text-xl md:text-2xl text-white mb-1 group-hover:text-accent-primary transition-colors duration-200">
                  {cat.nombre}
                </h3>
                <span className="inline-flex items-center gap-2 text-[#777] text-xs transition-colors duration-200 group-hover:text-[#E8FF00]">
                  Ver colección →
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {categorias.length > 0 && (
        <div className="mt-12 text-center">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary text-black font-bold rounded-lg hover:brightness-110 transition-all duration-200 font-display text-lg tracking-wider"
          >
            VER TODOS LOS PRODUCTOS
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
