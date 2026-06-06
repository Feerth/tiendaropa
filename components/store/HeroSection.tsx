import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] md:min-h-[92vh] flex items-center justify-center bg-bg-primary overflow-hidden">
      {/* Noise texture */}
      <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }} />

      {/* Mesh gradient layers */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-accent-primary/[0.02] via-transparent to-accent-primary/[0.01]" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-accent-tertiary/[0.01] via-transparent to-accent-tertiary/[0.02]" />

      {/* Diagonal line pattern */}
      <div className="absolute inset-0 z-[2] opacity-[0.04]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(232,255,0,0.3) 40px, rgba(232,255,0,0.3) 41px)`,
      }} />

      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-primary/[0.06] rounded-full blur-[100px] animate-float z-[3]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-tertiary/[0.04] rounded-full blur-[100px] animate-float z-[3]" style={{ animationDelay: "-3s" }} />
      <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-accent-secondary/[0.03] rounded-full blur-[80px] animate-float z-[3]" style={{ animationDelay: "-1.5s" }} />
      <div className="absolute bottom-1/3 left-1/3 w-[250px] h-[250px] bg-accent-primary/[0.04] rounded-full blur-[80px] animate-float z-[3]" style={{ animationDelay: "-4s" }} />
      <div className="absolute top-2/3 right-1/2 w-[200px] h-[200px] bg-accent-tertiary/[0.03] rounded-full blur-[60px] animate-float z-[3]" style={{ animationDelay: "-2.5s" }} />

      {/* Rotating orbital rings behind text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] w-[600px] h-[600px] rounded-full border border-accent-primary/[0.06] animate-spin-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] w-[480px] h-[480px] rounded-full border border-accent-tertiary/[0.05] animate-spin-slow-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] w-[380px] h-[380px] rounded-full border border-dashed border-accent-primary/[0.04] animate-spin-slow" style={{ animationDuration: "30s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] w-[700px] h-[700px] rounded-full border border-accent-secondary/[0.03] animate-spin-slow-reverse" style={{ animationDuration: "35s" }} />

      {/* Radial sunburst rays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] w-[700px] h-[700px] rounded-full opacity-[0.02] animate-spin-slow" style={{
        background: `conic-gradient(from 0deg, transparent, rgba(232,255,0,0.4) 10%, transparent 20%, rgba(0,255,178,0.4) 30%, transparent 40%, rgba(232,255,0,0.4) 50%, transparent 60%, rgba(0,255,178,0.4) 70%, transparent 80%, rgba(232,255,0,0.4) 90%, transparent)`,
        animationDuration: "40s",
      }} />

      {/* Horizontal light sweep */}
      <div className="absolute top-1/3 left-0 right-0 z-[5] h-px animate-sweep opacity-0" style={{
        background: "linear-gradient(90deg, transparent, rgba(232,255,0,0.15), transparent)",
      }} />
      <div className="absolute top-2/3 left-0 right-0 z-[5] h-px animate-sweep opacity-0" style={{
        background: "linear-gradient(90deg, transparent, rgba(0,255,178,0.1), transparent)",
        animationDelay: "2.5s",
      }} />

      {/* Pulsing glow behind DROP */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] w-[500px] h-[300px] bg-accent-primary/[0.04] rounded-full blur-[120px] animate-pulse-glow-ring" />

      {/* Floating particles */}
      <div className="absolute top-[15%] left-[10%] z-[5] w-1.5 h-1.5 rounded-full bg-accent-primary/40 animate-float" />
      <div className="absolute top-[20%] right-[15%] z-[5] w-1 h-1 rounded-full bg-accent-secondary/30 animate-float" style={{ animationDelay: "-1s", animationDuration: "7s" }} />
      <div className="absolute top-[35%] left-[5%] z-[5] w-2 h-2 rounded-full bg-accent-primary/20 animate-float" style={{ animationDelay: "-2s", animationDuration: "9s" }} />
      <div className="absolute top-[45%] right-[8%] z-[5] w-1.5 h-1.5 rounded-full bg-accent-tertiary/30 animate-float" style={{ animationDelay: "-3s", animationDuration: "6s" }} />
      <div className="absolute top-[60%] left-[12%] z-[5] w-1 h-1 rounded-full bg-accent-primary/25 animate-float" style={{ animationDelay: "-0.5s", animationDuration: "8s" }} />
      <div className="absolute top-[70%] right-[10%] z-[5] w-2 h-2 rounded-full bg-accent-secondary/20 animate-float" style={{ animationDelay: "-4s", animationDuration: "10s" }} />
      <div className="absolute top-[25%] left-[30%] z-[5] w-1 h-1 rounded-full bg-text-primary/15 animate-float" style={{ animationDelay: "-1.5s", animationDuration: "11s" }} />
      <div className="absolute top-[65%] left-[35%] z-[5] w-1.5 h-1.5 rounded-full bg-text-primary/10 animate-float" style={{ animationDelay: "-2.5s", animationDuration: "7s" }} />
      <div className="absolute top-[40%] right-[20%] z-[5] w-1 h-1 rounded-full bg-accent-primary/30 animate-float" style={{ animationDelay: "-3.5s", animationDuration: "8s" }} />
      <div className="absolute top-[80%] left-[20%] z-[5] w-1.5 h-1.5 rounded-full bg-accent-tertiary/20 animate-float" style={{ animationDelay: "-4.5s", animationDuration: "9s" }} />
      <div className="absolute top-[10%] right-[30%] z-[5] w-2 h-2 rounded-full bg-accent-primary/15 animate-float" style={{ animationDelay: "-0.8s", animationDuration: "12s" }} />
      <div className="absolute top-[75%] right-[35%] z-[5] w-1 h-1 rounded-full bg-accent-secondary/25 animate-float" style={{ animationDelay: "-1.8s", animationDuration: "6.5s" }} />

      {/* Vignette edges */}
      <div className="absolute inset-0 z-[6] bg-gradient-to-t from-bg-primary via-transparent to-bg-primary/50" />
      <div className="absolute inset-0 z-[6] bg-gradient-to-r from-bg-primary/40 via-transparent to-bg-primary/40" />

      {/* Corner decorative accents */}
      <div className="absolute top-8 left-8 z-[7] flex flex-col items-start gap-0.5 opacity-30">
        <div className="w-8 h-px bg-accent-primary" />
        <div className="w-px h-8 bg-accent-primary" />
      </div>
      <div className="absolute top-8 right-8 z-[7] flex flex-col items-end gap-0.5 opacity-30">
        <div className="w-8 h-px bg-accent-primary" />
        <div className="w-px h-8 bg-accent-primary" />
      </div>
      <div className="absolute bottom-8 left-8 z-[7] flex flex-col-reverse items-start gap-0.5 opacity-30">
        <div className="w-8 h-px bg-accent-primary" />
        <div className="w-px h-8 bg-accent-primary" />
      </div>
      <div className="absolute bottom-8 right-8 z-[7] flex flex-col-reverse items-end gap-0.5 opacity-30">
        <div className="w-8 h-px bg-accent-primary" />
        <div className="w-px h-8 bg-accent-primary" />
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[7] w-[600px] h-px bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent" />

      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-medium uppercase tracking-[0.15em] backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
              NEW SEASON 2026
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-7xl sm:text-8xl md:text-9xl lg:text-[140px] leading-none text-text-primary animate-fade-in" style={{ animationDelay: "0.15s" }}>
            DESCUBRE
            <br />
            EL NUEVO
            <br />
            <span className="relative inline-block">
              <span className="absolute inset-0 text-accent-primary blur-[40px] opacity-60 select-none">DROP</span>
              <span className="relative text-accent-primary [text-shadow:0_0_60px_rgba(232,255,0,0.4),0_0_120px_rgba(232,255,0,0.2)]">DROP</span>
            </span>
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="h-px w-12 bg-accent-primary/30" />
            <div className="w-2 h-2 rounded-full bg-accent-primary animate-glow" />
            <div className="h-px w-12 bg-accent-primary/30" />
          </div>

          {/* Description */}
          <p className="text-base md:text-lg text-text-secondary max-w-lg mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.45s" }}>
            Las zapatillas que marcan tendencia. Para quienes se atreven.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <Link
              href="/productos"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-accent-primary text-black font-bold rounded-lg hover:brightness-110 transition-all duration-200 font-display text-lg tracking-wider"
            >
              VER COLECCIÓN
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-200">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/productos?ordenar=nuevos"
              className="inline-flex items-center px-8 py-4 border border-[#222] text-text-primary font-medium rounded-lg hover:bg-bg-elevated hover:border-[rgba(232,255,0,0.35)] transition-all duration-200 font-display text-lg tracking-wider"
            >
              NOVEDADES
            </Link>
          </div>
        </div>
      </div>

      {/* Side scroll arrows */}
      <div className="absolute bottom-1/3 left-4 md:left-8 z-20 animate-fade-in opacity-20" style={{ animationDelay: "1s" }}>
        <svg width="20" height="32" viewBox="0 0 20 32" fill="none" className="animate-bounce-down">
          <path d="M10 0V24M10 24L2 16M10 24L18 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-primary" />
        </svg>
      </div>
      <div className="absolute bottom-1/3 right-4 md:right-8 z-20 animate-fade-in opacity-20" style={{ animationDelay: "1.2s" }}>
        <svg width="20" height="32" viewBox="0 0 20 32" fill="none" className="animate-bounce-down">
          <path d="M10 0V24M10 24L2 16M10 24L18 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-primary" />
        </svg>
      </div>
    </section>
  );
}
