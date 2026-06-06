"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import Image from "next/image";
import { colorToHex } from "@/lib/colors";
import type { Categoria } from "@prisma/client";

interface FiltersSidebarProps {
  categorias: Categoria[];
  marcas: { id: string; nombre: string; slug: string; imagenUrl: string | null }[];
  tallas: string[];
  colores: string[];
}

export function FiltersSidebar({ categorias, marcas, tallas, colores }: FiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQuery = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const categoriaActual = searchParams.get("categoria");
  const marcaActual = searchParams.get("marca");
  const tallaActual = searchParams.get("talla");
  const colorActual = searchParams.get("color");

  return (
    <div className="space-y-8">
      {/* Categorías */}
      <div>
        <h3 className="font-display text-lg text-text-primary mb-4">CATEGORÍAS</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => router.push(`/productos${searchParams.has("ordenar") ? `?ordenar=${searchParams.get("ordenar")}` : ""}`)}
              className={`text-sm transition-colors ${
                !categoriaActual ? "text-accent-primary font-medium" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Todas
            </button>
          </li>
          {categorias.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => router.push(`/productos?${createQuery("categoria", cat.slug)}`)}
                className={`text-sm transition-colors ${
                  categoriaActual === cat.slug
                    ? "text-accent-primary font-medium"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {cat.nombre}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Marcas */}
      <div>
        <h3 className="font-display text-lg text-text-primary mb-4">MARCAS</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => router.push(`/productos?${createQuery("marca", null)}`)}
              className={`text-sm transition-colors ${
                !marcaActual ? "text-accent-primary font-medium" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Todas
            </button>
          </li>
          {marcas.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => router.push(`/productos?${createQuery("marca", m.slug)}`)}
                className={`flex items-center gap-2 text-sm transition-colors w-full text-left ${
                  marcaActual === m.slug
                    ? "text-accent-primary font-medium"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {m.imagenUrl ? (
                  <Image
                    src={m.imagenUrl}
                    alt={m.nombre}
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full object-cover border border-border-subtle shrink-0"
                  />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center text-[10px] font-bold text-text-muted shrink-0">
                    {m.nombre[0]}
                  </span>
                )}
                {m.nombre}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tallas */}
      <div>
        <h3 className="font-display text-lg text-text-primary mb-4">TALLAS</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push(`/productos?${createQuery("talla", null)}`)}
            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
              !tallaActual
                ? "bg-accent-primary text-black border-accent-primary"
                : "bg-transparent text-text-secondary border-border-default hover:border-[rgba(232,255,0,0.35)]"
            }`}
          >
            Todas
          </button>
          {tallas.map((talla) => (
            <button
              key={talla}
              onClick={() => router.push(`/productos?${createQuery("talla", talla)}`)}
              className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                tallaActual === talla
                  ? "bg-accent-primary text-black border-accent-primary"
                  : "bg-transparent text-text-secondary border-border-default hover:border-[rgba(232,255,0,0.35)]"
              }`}
            >
              {talla}
            </button>
          ))}
        </div>
      </div>

      {/* Colores */}
      {colores.length > 0 && (
        <div>
          <h3 className="font-display text-lg text-text-primary mb-4">COLORES</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push(`/productos?${createQuery("color", null)}`)}
              className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                !colorActual
                  ? "bg-accent-primary text-black border-accent-primary"
                  : "bg-transparent text-text-secondary border-border-default hover:border-[rgba(232,255,0,0.35)]"
              }`}
            >
              Todos
            </button>
            {colores.map((color) => {
              const hex = colorToHex(color);
              const isActive = colorActual === color;
              return (
                <button
                  key={color}
                  onClick={() => router.push(`/productos?${createQuery("color", color)}`)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-colors ${
                    isActive
                      ? "bg-accent-primary text-black border-accent-primary"
                      : "bg-transparent text-text-secondary border-border-default hover:border-[rgba(232,255,0,0.35)]"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-border-default inline-block shrink-0"
                    style={{ backgroundColor: hex }}
                  />
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Ordenar */}
      <div>
        <h3 className="font-display text-lg text-text-primary mb-4">ORDENAR</h3>
        <select
          value={searchParams.get("ordenar") || "nuevos"}
          onChange={(e) => router.push(`/productos?${createQuery("ordenar", e.target.value)}`)}
          className="w-full bg-bg-card text-text-primary border border-border-default rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-primary"
        >
          <option value="nuevos">Más nuevos</option>
          <option value="precio_asc">Precio: menor a mayor</option>
          <option value="precio_desc">Precio: mayor a menor</option>
          <option value="destacados">Destacados</option>
        </select>
      </div>
    </div>
  );
}
