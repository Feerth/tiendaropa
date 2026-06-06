"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { getImagenesFiltradas } from "@/lib/colors";
import { Badge } from "@/components/shared/Badge";
import { ProductoDetalleClient } from "@/components/store/ProductoDetalleClient";
import { ProductGrid } from "@/components/store/ProductGrid";
import type { ProductoDetalle } from "@/types";

interface Props {
  producto: ProductoDetalle;
}

export function ProductoDetalleView({ producto }: Props) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedThumb, setSelectedThumb] = useState(0);

  const imagenesFiltradas = useMemo(
    () => getImagenesFiltradas(producto.imagenes, selectedColor),
    [producto.imagenes, selectedColor]
  );

  const totalStock = producto.variantes.reduce((sum, v) => sum + v.stock, 0);
  const isAgotado = totalStock === 0;
  const tieneOferta = !!producto.precioAntes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Galería */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-bg-secondary group/image md:cursor-crosshair border border-[#222]">
            {imagenesFiltradas[selectedThumb] ? (
              <Image
                key={`${selectedColor || "default"}-${selectedThumb}`}
                src={imagenesFiltradas[selectedThumb].url}
                alt={producto.nombre}
                fill
                className="object-cover transition-transform duration-500 md:group-hover/image:scale-150"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted font-display text-5xl">
                NOVASK
              </div>
            )}

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {tieneOferta && <Badge variant="oferta">OFERTA</Badge>}
              {isAgotado && <Badge variant="agotado">AGOTADO</Badge>}
            </div>
          </div>

          {imagenesFiltradas.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {imagenesFiltradas.map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setSelectedThumb(i)}
                  className={`relative aspect-square rounded-lg overflow-hidden bg-bg-secondary border-2 transition-all duration-200 ${
                    selectedThumb === i ? "border-accent-primary" : "border-transparent hover:border-[#E8FF00]"
                  }`}
                >
                  <Image src={img.url} alt={`${producto.nombre} ${i + 1}`} fill className="object-cover" sizes="100px" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            {producto.marca && (
              <p className="text-[10px] text-text-muted/60 uppercase tracking-wider mb-1">
                {producto.marca.nombre}
              </p>
            )}
            <p className="text-sm text-text-muted font-medium uppercase tracking-wider mb-2">
              {producto.categoria.nombre}
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-tight">
              {producto.nombre}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-bold text-accent-primary">
              {formatPrice(producto.precio)}
            </span>
            {tieneOferta && (
              <span className="font-mono text-lg text-text-muted line-through">
                {formatPrice(producto.precioAntes!)}
              </span>
            )}
          </div>

          {isAgotado ? (
            <p className="text-sm text-accent-secondary font-medium">
              ✕ Agotado — Sin stock disponible
            </p>
          ) : totalStock <= 5 ? (
            <p className="text-sm text-accent-secondary animate-pulse-stock font-medium">
              ⚡ Últimas {totalStock} unidades
            </p>
          ) : (
            <p className="text-sm text-accent-tertiary font-medium">
              ✓ Disponible — Stock suficiente
            </p>
          )}

          {producto.descripcion && (
            <p className="text-text-secondary leading-relaxed">{producto.descripcion}</p>
          )}

          <ProductoDetalleClient
            productoId={producto.id}
            nombre={producto.nombre}
            imagen={imagenesFiltradas[0]?.url || ""}
            precio={producto.precio}
            variantes={producto.variantes}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />

          {/* Productos relacionados */}
          {producto.relacionados.length > 0 && (
            <div className="pt-8 border-t border-border-subtle mt-8">
              <h2 className="font-display text-3xl text-text-primary mb-6">RELACIONADOS</h2>
              <ProductGrid productos={producto.relacionados} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
