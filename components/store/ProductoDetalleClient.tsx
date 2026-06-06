"use client";

import { useState, useMemo } from "react";
import { colorToHex, getColoresFromVariantes } from "@/lib/colors";
import { Button } from "@/components/shared/Button";
import { useCartStore } from "@/stores/cart";
import { getWhatsAppUrl, formatPrice } from "@/lib/utils";

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
  selectedColor: string | null;
  onColorChange: (color: string | null) => void;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51931869696";

export function ProductoDetalleClient({ productoId, nombre, imagen, precio, variantes, selectedColor, onColorChange }: Props) {
  const [selectedTalla, setSelectedTalla] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const coloresDisponibles = useMemo(
    () => getColoresFromVariantes(variantes),
    [variantes]
  );

  const variantesFiltradas = useMemo(() => {
    if (coloresDisponibles.length === 0) return variantes;
    if (!selectedColor) return [];
    return variantes.filter((v) => v.color?.toLowerCase().trim() === selectedColor);
  }, [variantes, selectedColor, coloresDisponibles]);

  const varianteSeleccionada = variantesFiltradas.find((v) => v.talla === selectedTalla);
  const isAgotado = varianteSeleccionada?.stock === 0;
  const sinVariante = variantesFiltradas.length === 1 && variantesFiltradas[0].talla === "Única";
  const sinColores = coloresDisponibles.length <= 1;
  const sinVariantesColor = variantesFiltradas.length === 0;

  const handleColorClick = (color: string) => {
    const next = selectedColor === color ? null : color;
    setSelectedTalla(null);
    setCantidad(1);
    onColorChange(next);
  };

  const handleAddToCart = () => {
    const talla = selectedTalla || (sinVariante ? "Única" : null);
    if (!talla || !varianteSeleccionada) return;

    const qty = Math.min(cantidad, varianteSeleccionada.stock);
    if (qty <= 0) return;

    addItem({
      varianteId: varianteSeleccionada.id,
      productoId,
      nombre,
      imagen,
      talla,
      color: varianteSeleccionada.color,
      precio,
      cantidad: qty,
      stockDisponible: varianteSeleccionada.stock,
    });
  };

  const handleWhatsAppConsult = () => {
    const talla = selectedTalla || (sinVariante ? "Única" : "");
    const color = selectedColor || "";
    const msg = `¡Hola! Quiero consultar sobre: ${nombre}${color ? ` - Color: ${color}` : ""}${talla ? ` - Talla: ${talla}` : ""} (S/ ${Number.isFinite(precio) ? precio.toFixed(2) : "0.00"})`;
    const encoded = encodeURIComponent(msg);
    window.open(getWhatsAppUrl(WHATSAPP_NUMBER, encoded), "_blank");
  };

  const isPrecioValido = Number.isFinite(precio);
  const tallaNoSeleccionada = !sinVariante && !selectedTalla;
  const btnDisabled = (!sinColores && !selectedColor) || tallaNoSeleccionada || isAgotado || !varianteSeleccionada || sinVariantesColor;

  let btnText = "AGREGAR AL CARRITO";
  if (!sinColores && !selectedColor) btnText = "Selecciona un color";
  else if (!selectedTalla && !sinVariante && !sinVariantesColor) btnText = "Selecciona una talla";
  else if (isAgotado) btnText = "AGOTADO";
  else if (sinVariantesColor && selectedColor) btnText = "Sin stock en este color";

  return (
    <div className="space-y-6">
      {/* Selector de color (swatches) */}
      {!sinColores && (
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">
            COLOR {selectedColor && <span className="text-accent-primary">— {selectedColor}</span>}
          </h3>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Colores disponibles">
            {coloresDisponibles.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Color ${color}`}
                  onClick={() => handleColorClick(color)}
                  className="flex flex-col items-center gap-1.5 group/swatch"
                >
                  <span
                    className={`w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-accent-primary scale-110"
                        : "border-border-default group-hover/swatch:border-[#E8FF00]"
                    }`}
                    style={{ backgroundColor: colorToHex(color) }}
                  />
                  <span className={`text-[9px] uppercase tracking-wider ${
                    isSelected ? "text-accent-primary font-medium" : "text-text-muted"
                  }`}>
                    {color}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sin stock en este color */}
      {sinVariantesColor && selectedColor && (
        <p className="text-sm text-accent-secondary font-medium">
          ✕ No hay variantes disponibles en este color
        </p>
      )}

      {/* Selector de talla — solo del color seleccionado */}
      {variantesFiltradas.length > 0 && !(variantesFiltradas.length === 1 && variantesFiltradas[0].talla === "Única") && (
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">
            TALLA {selectedTalla && <span className="text-accent-primary">— {selectedTalla}</span>}
          </h3>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tallas disponibles">
            {variantesFiltradas.map((v) => {
              const isSelected = v.talla === selectedTalla;
              const sinStock = v.stock === 0;
              return (
                <button
                  key={v.id}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Talla ${v.talla}${sinStock ? ", sin stock" : ""}`}
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
                        : "bg-transparent text-text-secondary border-border-default hover:border-[rgba(232,255,0,0.35)] hover:text-[#E8FF00]"
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
          <h3 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">CANTIDAD</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              disabled={cantidad <= 1}
              className="w-10 h-10 rounded-lg border border-[#222] flex items-center justify-center text-text-primary hover:bg-bg-elevated hover:border-[rgba(232,255,0,0.35)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Reducir cantidad"
            >
              −
            </button>
            <span className="font-mono text-lg w-8 text-center text-text-primary">{cantidad}</span>
            <button
              onClick={() => setCantidad(Math.min(varianteSeleccionada.stock, cantidad + 1))}
              disabled={cantidad >= varianteSeleccionada.stock}
              className="w-10 h-10 rounded-lg border border-[#222] flex items-center justify-center text-text-primary hover:bg-bg-elevated hover:border-[rgba(232,255,0,0.35)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
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
          disabled={btnDisabled || !isPrecioValido}
          className="flex-1"
        >
          {btnText}
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
