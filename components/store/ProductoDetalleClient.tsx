"use client";

import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { useCartStore } from "@/stores/cart";
import { getWhatsAppUrl, formatPrice, generateWhatsAppMessage } from "@/lib/utils";

interface VarianteInfo {
  id: string;
  talla: string;
  color: string | null;
  stock: number;
  sku: string | null;
}

interface Props {
  productoId: string;
  nombre: string;
  imagen: string;
  precio: number;
  variantes: VarianteInfo[];
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51931869696";

export function ProductoDetalleClient({ productoId, nombre, imagen, precio, variantes }: Props) {
  const [selectedTalla, setSelectedTalla] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const varianteSeleccionada = variantes.find((v) => v.talla === selectedTalla);
  const isAgotado = varianteSeleccionada?.stock === 0;
  const sinVariante = variantes.length === 1 && variantes[0].talla === "Única";

  const handleAddToCart = () => {
    const talla = selectedTalla || (sinVariante ? "Única" : null);
    if (!talla || !varianteSeleccionada) return;

    addItem({
      varianteId: varianteSeleccionada.id,
      productoId,
      nombre,
      imagen,
      talla,
      color: varianteSeleccionada.color,
      precio,
      cantidad: Math.min(cantidad, varianteSeleccionada.stock),
      stockDisponible: varianteSeleccionada.stock,
    });
  };

  const handleWhatsAppConsult = () => {
    const talla = selectedTalla || (sinVariante ? "Única" : "");
    const message = `¡Hola! Quiero consultar sobre: ${nombre}${talla ? ` - Talla: ${talla}` : ""} (S/ ${precio.toFixed(2)})`;
    window.open(getWhatsAppUrl(WHATSAPP_NUMBER, message), "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Selector de talla */}
      {!sinVariante && (
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-3">
            TALLA {selectedTalla && <span className="text-accent-primary">— {selectedTalla}</span>}
          </h3>
          <div className="flex flex-wrap gap-2">
            {variantes.map((v) => {
              const isSelected = v.talla === selectedTalla;
              const sinStock = v.stock === 0;
              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedTalla(v.talla);
                    setCantidad(1);
                  }}
                  disabled={sinStock}
                  className={`
                    min-w-[48px] px-4 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200
                    ${isSelected
                      ? "bg-accent-primary text-black border-accent-primary"
                      : sinStock
                        ? "bg-transparent text-text-muted border-border-subtle line-through cursor-not-allowed"
                        : "bg-transparent text-text-secondary border-border-default hover:border-border-strong hover:text-text-primary"
                    }
                  `}
                >
                  {v.talla}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Cantidad */}
      {varianteSeleccionada && !isAgotado && (
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-3">CANTIDAD</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="w-10 h-10 rounded-lg border border-border-default flex items-center justify-center text-text-primary hover:bg-bg-elevated transition-colors"
              aria-label="Reducir cantidad"
            >
              −
            </button>
            <span className="font-mono text-lg w-8 text-center text-text-primary">{cantidad}</span>
            <button
              onClick={() => setCantidad(Math.min(varianteSeleccionada.stock, cantidad + 1))}
              className="w-10 h-10 rounded-lg border border-border-default flex items-center justify-center text-text-primary hover:bg-bg-elevated transition-colors"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={(!sinVariante && !selectedTalla) || isAgotado || !varianteSeleccionada}
          className="flex-1"
        >
          {!selectedTalla && !sinVariante
            ? "Selecciona una talla"
            : isAgotado
              ? "AGOTADO"
              : "AGREGAR AL CARRITO"}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={handleWhatsAppConsult}
          className="flex-1"
        >
          CONSULTAR POR WhatsApp
        </Button>
      </div>
    </div>
  );
}
