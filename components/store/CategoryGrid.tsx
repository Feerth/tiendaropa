import Link from "next/link";

const categories = [
  {
    name: "HOMBRES",
    slug: "ropa",
    gradient: "from-blue-900/40 to-purple-900/40",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    name: "MUJERES",
    slug: "ropa",
    gradient: "from-pink-900/40 to-rose-900/40",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    name: "ZAPATILLAS",
    slug: "zapatillas",
    gradient: "from-yellow-900/40 to-orange-900/40",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 18.51 18.51 0 0 1-3.52-3.52 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 6.11 2h3a2 2 0 0 1 2 1.72 13 13 0 0 0 .3 1.54 13.13 13.13 0 0 0 .83 1.92L9 12l4 4 3.82-3.24a14.07 14.07 0 0 0 1.92.83 13 13 0 0 0 1.54.3 2 2 0 0 1 1.72 2v3z" />
      </svg>
    ),
  },
];

export function CategoryGrid() {
  return (
    <section className="py-16 md:py-20 max-w-7xl mx-auto px-4">
      <div className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 md:pb-0 md:grid md:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/productos?categoria=${cat.slug}`}
            className="group relative min-w-[260px] md:min-w-0 aspect-[3/4] rounded-2xl overflow-hidden snap-start transition-all duration-500 hover:-translate-y-1"
          >
            {/* Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} transition-transform duration-700 group-hover:scale-105`} />

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }} />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <div className="mb-3 text-accent-primary/80 group-hover:text-accent-primary transition-colors">
                {cat.icon}
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-white mb-2 group-hover:text-accent-primary transition-colors">
                {cat.name}
              </h3>
              <span className="inline-flex items-center gap-2 text-sm text-text-muted group-hover:text-white transition-colors">
                Ver todo →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
