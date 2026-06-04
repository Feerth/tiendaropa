import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { ProductoListItem } from "@/types";

interface ProductCardProps {
  producto: ProductoListItem;
}

export function ProductCard({ producto }: ProductCardProps) {
  const totalStock = producto.variantes.reduce((sum, v) => sum + v.stock, 0);
  const isAgotado = totalStock === 0;
  const stockBajo = totalStock > 0 && totalStock <= 5;
  const tieneOferta = !!producto.precioAntes;
  const pctOferta = tieneOferta
    ? Math.round((1 - Number(producto.precio) / Number(producto.precioAntes)) * 100)
    : 0;
  const isNew = new Date(producto.creadoEn).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <article className="group bg-bg-card rounded-xl border border-border-subtle overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-accent-primary/20">
      {/* Image section */}
      <Link href={`/productos/${producto.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-bg-secondary">
        {producto.imagenes[0] ? (
          <Image
            src={producto.imagenes[0]}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted font-display text-3xl">
            ADNSTORE
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] bg-accent-primary text-black">
              NEW DROP
            </span>
          )}
          {tieneOferta && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] bg-accent-secondary text-white">
              -{pctOferta}%
            </span>
          )}
          {isAgotado && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/30">
              SOLD OUT
            </span>
          )}
          {stockBajo && !isAgotado && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/30 animate-pulse-stock">
              LAST UNITS
            </span>
          )}
        </div>
      </Link>

      {/* Info section */}
      <div className="p-4 space-y-3">
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold text-accent-primary">
            {formatPrice(Number(producto.precio))}
          </span>
          {tieneOferta && (
            <span className="font-mono text-xs text-text-muted line-through">
              {formatPrice(Number(producto.precioAntes))}
            </span>
          )}
        </div>

        {/* Name + Category */}
        <div>
          <h3 className="font-medium text-sm text-text-primary leading-tight line-clamp-1 group-hover:text-accent-primary transition-colors">
            {producto.nombre}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            {producto.categoria.nombre}
          </p>
        </div>

        {/* Dual buttons */}
        <div className="flex gap-2 pt-1">
          <Link
            href={`/productos/${producto.slug}`}
            className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-border-default text-text-primary rounded-lg text-[11px] font-medium hover:bg-bg-elevated hover:border-accent-primary/30 transition-all duration-200"
          >
            AGREGAR
          </Link>
          <Link
            href={`/productos/${producto.slug}`}
            className="flex-1 inline-flex items-center justify-center px-3 py-1.5 bg-accent-primary text-black rounded-lg text-[11px] font-semibold hover:brightness-110 transition-all duration-200"
          >
            VER →
          </Link>
        </div>
      </div>
    </article>
  );
}
