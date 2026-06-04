import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center bg-bg-primary overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/95 to-bg-primary/80 z-10" />

      {/* Background image placeholder (gradient pattern) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-primary/5" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-3/4 bg-gradient-to-l from-accent-primary/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-8 items-center">
        {/* Left column — text */}
        <div className="space-y-6 md:space-y-8 py-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-medium uppercase tracking-[0.15em]">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
            New Season 2026
          </span>

          <h1 className="font-display text-7xl sm:text-8xl md:text-9xl lg:text-[120px] leading-none text-text-primary">
            DESCUBRE
            <br />
            EL NUEVO
            <br />
            <span className="text-accent-primary">DROP</span>
          </h1>

          <div className="w-16 h-0.5 bg-accent-primary/50" />

          <p className="text-base md:text-lg text-text-secondary max-w-md leading-relaxed">
            Ropa y zapatillas seleccionadas para los que marcan tendencia.
            Estilo auténtico, calidad premium.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary text-black font-bold rounded-lg hover:brightness-110 transition-all duration-200 font-display text-lg tracking-wider"
            >
              VER COLECCIÓN
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/productos?ordenar=nuevos"
              className="inline-flex items-center px-8 py-4 border border-border-strong text-text-primary font-medium rounded-lg hover:bg-bg-elevated hover:border-accent-primary/30 transition-all duration-200 font-display text-lg tracking-wider"
            >
              NOVEDADES
            </Link>
          </div>
        </div>

        {/* Right column — image/model */}
        <div className="hidden md:block relative h-[70vh] lg:h-[85vh] rounded-2xl overflow-hidden bg-gradient-to-b from-accent-primary/20 to-bg-secondary">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto rounded-full bg-accent-primary/10 flex items-center justify-center">
                <span className="font-display text-6xl text-accent-primary/30">ADN</span>
              </div>
              <p className="text-text-muted text-sm font-medium tracking-wider uppercase">
                Lookbook 2026
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-primary" />
                <div className="w-2 h-2 rounded-full bg-border-default" />
                <div className="w-2 h-2 rounded-full bg-border-default" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
