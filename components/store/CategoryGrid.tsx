import Link from "next/link";
import type { Categoria } from "@prisma/client";

interface Props {
  categorias: Categoria[];
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

export function CategoryGrid({ categorias }: Props) {
  const visible = categorias.slice(0, 4);
  const hasMore = categorias.length > 4;

  const cols =
    visible.length === 2 ? "md:grid-cols-2" :
    visible.length === 3 ? "md:grid-cols-3" :
    "md:grid-cols-4";

  return (
    <section className="py-16 md:py-20 max-w-7xl mx-auto px-4">
      <div className="mb-10">
        <h2 className="font-display text-6xl md:text-7xl text-text-primary leading-none">
          EXPLORA
          <br />
          <span className="text-accent-primary">POR ESTILO</span>
        </h2>
        <p className="text-text-secondary text-sm md:text-base mt-3">
          Encuentra tu próximo par.
        </p>
      </div>

      <div className={`grid grid-cols-2 ${cols} gap-3 md:gap-4`}>
        {visible.map((cat, index) => {
          const bgImage = cat.imagenUrl || `/images/categorias/${cat.slug}.webp`;
          return (
          <Link
            key={cat.id}
            href={`/productos?categoria=${cat.slug}`}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-[#222] transition-all duration-[250ms] ease-in-out hover:-translate-y-1 hover:border-[rgba(232,255,0,0.35)]"
          >
            {/* Background gradient (fallback) */}
            <div className="absolute inset-0 transition-transform duration-[350ms] ease-in-out group-hover:scale-[1.04]"
              style={{ background: GRADIENTS[index % GRADIENTS.length] }}
            />
            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src={bgImage}
                alt={cat.nombre}
                className="w-full h-full object-cover transition-transform duration-[350ms] ease-in-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }} />

            {/* Watermark text */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
              <span className="font-display text-[80px] md:text-[120px] text-white/5 leading-none -rotate-12 whitespace-nowrap">
                {cat.nombre.toUpperCase()}
              </span>
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            {/* Neon line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8FF00] scale-x-0 origin-left transition-transform duration-[250ms] ease-in-out group-hover:scale-x-100 z-10" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
              <div className="mb-2 text-accent-primary/80 group-hover:text-accent-primary transition-colors duration-200">
                <SneakerIcon />
              </div>
              <h3 className="font-display text-xl md:text-2xl text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-accent-primary transition-colors duration-200">
                {cat.nombre}
              </h3>
              <span className="inline-flex items-center gap-2 text-[#999] text-xs transition-colors duration-200 group-hover:text-[#E8FF00] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                Ver todo →
              </span>
            </div>
          </Link>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary transition-colors font-display tracking-wider"
          >
            Ver todas las categorías →
          </Link>
        </div>
      )}
    </section>
  );
}
