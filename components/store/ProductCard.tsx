"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect, useRef } from "react";
import { formatPrice } from "@/lib/utils";
import { colorToHex, getImagenPorColor, getColoresFromVariantes } from "@/lib/colors";
import type { ProductoListItem } from "@/types";

interface ProductCardProps {
  producto: ProductoListItem;
  colorFilter?: string | null;
}

export function ProductCard({ producto, colorFilter }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [pinnedColor, setPinnedColor] = useState<string | null>(colorFilter || null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    setPinnedColor(colorFilter || null);
  }, [colorFilter]);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  const effectiveColor = hoveredColor ?? pinnedColor;

  useEffect(() => {
    setImgError(false);
  }, [effectiveColor]);

  const coloresDisponibles = useMemo(
    () => getColoresFromVariantes(producto.variantes.filter((v) => v.stock > 0)),
    [producto.variantes]
  );

  const currentImage = useMemo(
    () => getImagenPorColor(producto.imagenes, effectiveColor) || producto.imagenes[0]?.url || "",
    [producto.imagenes, effectiveColor]
  );

  const totalStock = producto.variantes.reduce((sum, v) => sum + v.stock, 0);
  const isAgotado = totalStock === 0;
  const stockBajo = totalStock > 0 && totalStock <= 5;
  const tieneOferta = !!producto.precioAntes && Number(producto.precioAntes) > Number(producto.precio);
  const pctOferta = tieneOferta
    ? Math.round((1 - Number(producto.precio) / Number(producto.precioAntes)) * 100)
    : 0;
  const isNew = new Date(producto.creadoEn).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <article className="group bg-bg-card rounded-xl border border-[#222] overflow-hidden transition-all duration-[250ms] ease-in-out hover:-translate-y-1 hover:border-[rgba(232,255,0,0.35)]">
      {/* Image section */}
      <Link href={`/productos/${producto.slug}`} className="block relative aspect-square overflow-hidden bg-bg-secondary">
        {currentImage && !imgError ? (
          <Image
            key={effectiveColor || "default"}
            src={currentImage}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-[350ms] ease-in-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => { if (mountedRef.current) setImgError(true); }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {isNew && (
            <span className="w-fit px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] bg-accent-primary text-black">
              NEW DROP
            </span>
          )}
          {tieneOferta && pctOferta > 0 && (
            <span className="w-fit px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] bg-accent-secondary text-white">
              -{pctOferta}%
            </span>
          )}
          {isAgotado && (
            <span className="w-fit px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/30">
              AGOTADO
            </span>
          )}
          {stockBajo && !isAgotado && (
            <span className="w-fit px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/30 animate-pulse-stock">
              ÚLTIMAS UNIDADES
            </span>
          )}
        </div>

        {/* Neon line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8FF00] scale-x-0 origin-left transition-transform duration-[250ms] ease-in-out group-hover:scale-x-100 z-10" />
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
          <h3 className="font-medium text-sm text-text-primary leading-tight line-clamp-1 group-hover:text-[#E8FF00] transition-colors duration-200">
            {producto.nombre}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            {producto.categoria.nombre}
          </p>
          {producto.marca && (
            <p className="text-[10px] text-text-muted/60 uppercase tracking-wider mt-0.5">
              {producto.marca.nombre}
            </p>
          )}
        </div>

        {/* Color circles */}
        {coloresDisponibles.length > 1 && (
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Colores disponibles">
            {coloresDisponibles.map((color) => {
              const isSelected = effectiveColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Color ${color}`}
                  title={color}
                  onClick={(e) => {
                    e.preventDefault();
                    setPinnedColor(isSelected ? null : color);
                    setImgError(false);
                  }}
                  onMouseEnter={() => {
                    setHoveredColor(color);
                    setImgError(false);
                  }}
                  onMouseLeave={() => {
                    setHoveredColor(null);
                  }}
                  onFocus={() => setHoveredColor(color)}
                  onBlur={() => setHoveredColor(null)}
                  className={`w-[18px] h-[18px] rounded-full border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-accent-primary scale-110"
                      : "border-border-default hover:border-[#E8FF00]"
                  }`}
                  style={{ backgroundColor: colorToHex(color) }}
                />
              );
            })}
          </div>
        )}

        {/* Dual buttons */}
        <div className="flex gap-2">
          <Link
            href={`/productos/${producto.slug}`}
            className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-[#222] text-text-primary rounded-lg text-[11px] font-medium hover:bg-bg-elevated hover:border-[rgba(232,255,0,0.35)] transition-all duration-200"
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
