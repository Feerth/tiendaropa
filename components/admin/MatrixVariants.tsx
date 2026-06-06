"use client";

import { useState, useCallback, useMemo } from "react";
import { colorToHex, COLOR_NAMES } from "@/lib/colors";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";

export type ColorRow = {
  color: string;
  stocks: Record<string, number>;
};

interface Props {
  initialTallas?: string[];
  initialColorRows?: ColorRow[];
  onChange: (tallas: string[], colorRows: ColorRow[]) => void;
}

function generateSku(color: string, talla: string): string {
  return `${color.toLowerCase().replace(/\s+/g, "-")}-${talla}`;
}

export function flattenMatrix(tallas: string[], colorRows: ColorRow[]) {
  const result: { talla: string; color: string; stock: number; sku: string }[] = [];
  for (const row of colorRows) {
    for (const talla of tallas) {
      const stock = row.stocks[talla] ?? 0;
      result.push({
        talla,
        color: row.color,
        stock,
        sku: generateSku(row.color, talla),
      });
    }
  }
  return result;
}

export function inflateToMatrix(
  variantes: { talla: string; color?: string | null; stock: number }[]
): { tallas: string[]; colorRows: ColorRow[] } {
  const tallaSet = new Set<string>();
  const colorMap = new Map<string, Record<string, number>>();

  for (const v of variantes) {
    const color = v.color?.trim() || "default";
    tallaSet.add(v.talla);
    if (!colorMap.has(color)) colorMap.set(color, {});
    colorMap.get(color)![v.talla] = v.stock;
  }

  const colorRows: ColorRow[] = [];
  for (const [color, stocks] of colorMap) {
    colorRows.push({ color, stocks: { ...stocks } });
  }

  return {
    tallas: Array.from(tallaSet).sort(),
    colorRows,
  };
}

export function MatrixVariants({ initialTallas, initialColorRows, onChange }: Props) {
  const [tallas, setTallas] = useState<string[]>(initialTallas || []);
  const [colorRows, setColorRows] = useState<ColorRow[]>(initialColorRows || []);
  const [newTalla, setNewTalla] = useState("");
  const [newColor, setNewColor] = useState("");

  const notify = useCallback(
    (t: string[], c: ColorRow[]) => {
      onChange(t, c);
    },
    [onChange]
  );

  const addTalla = () => {
    const trimmed = newTalla.trim();
    if (!trimmed || tallas.includes(trimmed)) return;
    const next = [...tallas, trimmed].sort();
    setTallas(next);
    setNewTalla("");
    notify(next, colorRows);
  };

  const removeTalla = (talla: string) => {
    const next = tallas.filter((t) => t !== talla);
    const nextRows = colorRows.map((r) => {
      const { [talla]: _, ...rest } = r.stocks;
      return { color: r.color, stocks: rest };
    });
    setTallas(next);
    setColorRows(nextRows);
    notify(next, nextRows);
  };

  const addColor = () => {
    const trimmed = newColor.trim();
    if (!trimmed || colorRows.some((r) => r.color.toLowerCase() === trimmed.toLowerCase())) return;
    const stocks: Record<string, number> = {};
    for (const t of tallas) stocks[t] = 0;
    const next = [...colorRows, { color: trimmed, stocks }];
    setColorRows(next);
    setNewColor("");
    notify(tallas, next);
  };

  const removeColor = (color: string) => {
    const next = colorRows.filter((r) => r.color !== color);
    setColorRows(next);
    notify(tallas, next);
  };

  const updateStock = (color: string, talla: string, value: number) => {
    const next = colorRows.map((r) => {
      if (r.color !== color) return r;
      return { ...r, stocks: { ...r.stocks, [talla]: value } };
    });
    setColorRows(next);
    notify(tallas, next);
  };

  const updateColorName = (oldColor: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (colorRows.some((r) => r.color.toLowerCase() === trimmed.toLowerCase() && r.color !== oldColor)) return;
    const next = colorRows.map((r) => {
      if (r.color !== oldColor) return r;
      return { ...r, color: trimmed };
    });
    setColorRows(next);
    notify(tallas, next);
  };

  const colores = useMemo(() => colorRows.map((r) => r.color), [colorRows]);

  return (
    <div className="space-y-6">
      {/* Tallas */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">Tallas</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tallas.map((talla) => (
            <span
              key={talla}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-primary/10 border border-accent-primary/30 text-sm text-accent-primary"
            >
              {talla}
              <button
                type="button"
                onClick={() => removeTalla(talla)}
                className="text-accent-primary/60 hover:text-accent-primary transition-colors"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-[200px]">
            <Input
              placeholder="Ej: 38"
              value={newTalla}
              onChange={(e) => setNewTalla(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTalla(); } }}
            />
            <datalist id="talla-suggestions">
              {Array.from({ length: 16 }, (_, i) => i + 35).map((t) => (
                <option key={t} value={String(t)} />
              ))}
            </datalist>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={addTalla}>
            + AGREGAR TALLA
          </Button>
        </div>
      </div>

      {/* Colores / Matrix */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">Colores y stock</label>

        {tallas.length > 0 && colorRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-text-muted font-medium uppercase tracking-wider text-xs pb-2 pr-4">
                    Color
                  </th>
                  {tallas.map((talla) => (
                    <th
                      key={talla}
                      className="text-center text-text-muted font-medium uppercase tracking-wider text-xs pb-2 px-2 min-w-[60px]"
                    >
                      {talla}
                    </th>
                  ))}
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {colorRows.map((row) => (
                  <tr key={row.color}>
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-border-default shrink-0"
                          style={{ backgroundColor: colorToHex(row.color) }}
                        />
                        <input
                          value={row.color}
                          onChange={(e) => updateColorName(row.color, e.target.value)}
                          list={`color-list-matrix`}
                          className="bg-transparent text-text-primary text-sm border-none outline-none focus:ring-0 p-0 w-full min-w-[80px]"
                        />
                      </div>
                    </td>
                    {tallas.map((talla) => (
                      <td key={talla} className="py-2 px-2">
                        <input
                          type="number"
                          min={0}
                          value={row.stocks[talla] ?? 0}
                          onChange={(e) => updateStock(row.color, talla, Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full text-center bg-bg-secondary border border-border-default rounded-lg px-2 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </td>
                    ))}
                    <td className="py-2 pl-2">
                      <button
                        type="button"
                        onClick={() => removeColor(row.color)}
                        className="text-xs text-accent-secondary hover:text-accent-secondary/80 transition-colors"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-text-muted py-4">
            {tallas.length === 0
              ? "Agrega al menos una talla para empezar."
              : "Agrega colores para llenar la matriz de stock."}
          </p>
        )}

        <div className="flex gap-2 mt-3">
          <div className="relative flex-1 max-w-[200px]">
            <Input
              placeholder="Ej: Negro, Blanco..."
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(); } }}
              list="color-list-matrix-input"
            />
            <datalist id="color-list-matrix-input">
              {COLOR_NAMES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={addColor}>
            + AGREGAR COLOR
          </Button>
        </div>
      </div>
    </div>
  );
}
