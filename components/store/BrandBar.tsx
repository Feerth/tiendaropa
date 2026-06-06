import Link from "next/link";
import Image from "next/image";

interface Brand {
  id: string;
  nombre: string;
  slug: string;
  imagenUrl: string | null;
}

interface Props {
  marcas: Brand[];
}

export function BrandBar({ marcas }: Props) {
  if (marcas.length === 0) return null;

  return (
    <section className="py-16 md:py-20 border-y border-border-subtle bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl md:text-3xl text-text-primary text-center mb-10">
          MARCAS
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {marcas.map((marca) => (
            <Link
              key={marca.id}
              href={`/productos?marca=${marca.slug}`}
              className="group flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-bg-card border-2 border-border-default group-hover:border-accent-primary group-hover:shadow-[0_0_20px_rgba(232,255,0,0.25)] transition-all duration-300 flex items-center justify-center">
                {marca.imagenUrl ? (
                  <Image
                    src={marca.imagenUrl}
                    alt={marca.nombre}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-lg font-bold text-text-muted group-hover:text-accent-primary transition-colors duration-300">
                    {marca.nombre[0]}
                  </span>
                )}
              </div>
              <span className="text-xs text-text-muted group-hover:text-accent-primary font-medium uppercase tracking-wider transition-colors duration-300">
                {marca.nombre}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
