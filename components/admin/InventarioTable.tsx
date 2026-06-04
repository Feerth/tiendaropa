"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { useToastStore } from "@/stores/toast";
import type { Variante, Producto } from "@prisma/client";

type VarianteWithProducto = Variante & {
  producto: Pick<Producto, "id" | "nombre" | "slug" | "activo">;
};

interface Props {
  variantes: VarianteWithProducto[];
}

function escapeCsv(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export function InventarioTable({ variantes }: Props) {
  const router = useRouter();
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const handleSave = async (varianteId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stock/${varianteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: editValue }),
      });

      const result = await res.json();
      if (!result.success) {
        addToast(result.error, "error");
        return;
      }

      setEditId(null);
      addToast("Stock actualizado", "success");
      router.refresh();
    } catch {
      addToast("Error al actualizar stock", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Producto", "Talla", "Color", "Stock", "SKU", "Estado"];
    const rows = variantes.map((v) => [
      escapeCsv(v.producto.nombre),
      escapeCsv(v.talla),
      escapeCsv(v.color || ""),
      String(v.stock),
      escapeCsv(v.sku || ""),
      escapeCsv(v.producto.activo ? "Activo" : "Inactivo"),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventario.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="p-4 border-b border-border-subtle flex justify-end">
        <Button variant="secondary" size="sm" onClick={handleExportCSV}>
          EXPORTAR CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Producto</th>
              <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Talla</th>
              <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Color</th>
              <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">SKU</th>
              <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Stock</th>
              <th className="text-right p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Acción</th>
            </tr>
          </thead>
          <tbody>
            {variantes.map((v) => (
              <tr
                key={v.id}
                className={`border-b border-border-subtle transition-colors ${
                  v.stock === 0
                    ? "bg-accent-secondary/5"
                    : v.stock <= 3
                      ? "bg-accent-primary/5"
                      : "hover:bg-bg-elevated/50"
                }`}
              >
                <td className="p-4 text-text-primary font-medium">{v.producto.nombre}</td>
                <td className="p-4 text-text-secondary">{v.talla}</td>
                <td className="p-4 text-text-secondary">{v.color || "—"}</td>
                <td className="p-4 text-text-muted font-mono text-xs">{v.sku || "—"}</td>
                <td className="p-4">
                  {editId === v.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value === "" ? 0 : Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded bg-bg-secondary border border-border-default text-text-primary text-sm text-center"
                        aria-label="Nuevo valor de stock"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleSave(v.id)} loading={loading}>
                        OK
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>
                        X
                      </Button>
                    </div>
                  ) : (
                    <span
                      className={`font-mono font-bold ${
                        v.stock === 0
                          ? "text-accent-secondary"
                          : v.stock <= 3
                            ? "text-accent-primary"
                            : "text-text-primary"
                      }`}
                    >
                      {v.stock}
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditId(v.id);
                      setEditValue(v.stock);
                    }}
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
