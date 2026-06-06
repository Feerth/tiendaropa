"use client";

import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "@/components/shared/Skeleton";
import type { ProductoListItem } from "@/types";

interface ProductGridProps {
  productos: ProductoListItem[];
  loading?: boolean;
  colorFilter?: string | null;
}

export function ProductGrid({ productos, loading, colorFilter }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted font-display text-4xl mb-2">SIN RESULTADOS</p>
        <p className="text-text-secondary text-sm">No encontramos productos con esos filtros.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {productos.map((producto, index) => (
        <div key={producto.id} className="animate-fade-in" style={{ animationDelay: `${(index % 4) * 100}ms` }}>
          <ProductCard producto={producto} colorFilter={colorFilter} />
        </div>
      ))}
    </div>
  );
}
