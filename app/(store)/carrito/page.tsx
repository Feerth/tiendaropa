"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/stores/cart";
import { Button } from "@/components/shared/Button";
import { formatPrice, getWhatsAppUrl, generateWhatsAppMessage } from "@/lib/utils";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51931869696";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [checkoutDone, setCheckoutDone] = useState(false);
  const total = getTotal();

  const handleWhatsAppCheckout = () => {
    const message = generateWhatsAppMessage(
      items.map((item) => ({
        nombre: item.nombre,
        talla: item.talla,
        cantidad: item.cantidad,
        precio: item.precio,
      })),
      total
    );
    window.open(getWhatsAppUrl(WHATSAPP_NUMBER, message), "_blank");
    setCheckoutDone(true);
  };

  const handleClearCart = () => {
    if (checkoutDone && confirm("¿Vaciar el carrito?")) {
      clearCart();
      setCheckoutDone(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-5xl text-text-primary mb-4">CARRITO VACÍO</h1>
        <p className="text-text-secondary mb-8">No tienes productos en tu carrito.</p>
        <Link href="/productos">
          <Button size="lg">VER PRODUCTOS</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-5xl text-text-primary mb-8">CARRITO</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.varianteId}
            className="flex gap-4 bg-bg-card rounded-xl border border-border-subtle p-4"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-bg-secondary shrink-0">
              {item.imagen ? (
                <Image src={item.imagen} alt={item.nombre} fill className="object-cover" sizes="100px" />
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted font-display text-lg">
                  ADNSTORE
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-text-primary text-sm sm:text-base truncate">
                {item.nombre}
              </h3>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                Talla: {item.talla}{item.color ? ` · ${item.color}` : ""}
              </p>
              <p className="font-mono text-sm text-accent-primary mt-1">
                {formatPrice(item.precio)}
              </p>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.varianteId, item.cantidad - 1)}
                    className="w-8 h-8 rounded-lg border border-border-default flex items-center justify-center text-text-secondary hover:bg-bg-elevated transition-colors text-sm"
                    aria-label={`Reducir cantidad de ${item.nombre}`}
                  >
                    −
                  </button>
                  <span className="font-mono text-sm w-6 text-center text-text-primary">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.varianteId, item.cantidad + 1)}
                    className="w-8 h-8 rounded-lg border border-border-default flex items-center justify-center text-text-secondary hover:bg-bg-elevated transition-colors text-sm"
                    aria-label={`Aumentar cantidad de ${item.nombre}`}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.varianteId)}
                  className="text-xs text-text-muted hover:text-accent-secondary transition-colors"
                  aria-label="Eliminar producto"
                >
                  ELIMINAR
                </button>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="font-mono text-sm font-bold text-text-primary">
                {formatPrice(item.precio * item.cantidad)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-bg-card rounded-xl border border-border-subtle p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-text-secondary">Total</span>
          <span className="font-mono text-2xl font-bold text-accent-primary">
            {formatPrice(total)}
          </span>
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={handleWhatsAppCheckout}
        >
          FINALIZAR PEDIDO POR WHATSAPP
        </Button>

        {checkoutDone && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-accent-tertiary text-center">
              ✅ Pedido enviado a WhatsApp
            </p>
            <button
              onClick={handleClearCart}
              className="text-xs text-text-muted hover:text-text-secondary underline block mx-auto"
            >
              Vaciar carrito
            </button>
          </div>
        )}

        <p className="text-xs text-text-muted text-center mt-3">
          Recibirás un resumen detallado de tu pedido en WhatsApp.
        </p>
      </div>
    </div>
  );
}
