"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { useToastStore } from "@/stores/toast";

interface PedidoData {
  id: string;
  numero: number;
  nombreCliente: string;
  telefono: string;
  email: string | null;
  total: number;
  estado: string;
  estadoPago: string;
  notas: string | null;
  notasAdmin: string | null;
  comprobante: string | null;
  items: {
    nombreProducto: string;
    talla: string;
    color: string | null;
    cantidad: number;
    precioUnit: number;
    imagenUrl: string | null;
  }[];
}

interface Props {
  pedido: PedidoData;
  onClose: () => void;
}

export function PaymentConfirmModal({ pedido, onClose }: Props) {
  const router = useRouter();
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  const handleAction = async (accion: "CONFIRMAR" | "RECHAZAR") => {
    if (accion === "RECHAZAR" && !notas.trim()) {
      addToast("Agrega una nota explicando el motivo del rechazo", "error");
      return;
    }

    setLoading(accion);
    try {
      const res = await fetch(`/api/admin/pedidos/${pedido.id}/confirmar-pago`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion, notas: notas.trim() || undefined }),
      });
      const result = await res.json();
      if (!result.success) {
        addToast(result.error, "error");
        return;
      }
      router.refresh();
      onClose();
    } catch {
      addToast("Error al procesar", "error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-bg-card border border-border-default rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-text-primary">
              Pago #{pedido.numero}
            </h2>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary text-lg">
              ✕
            </button>
          </div>

          <div className="space-y-3 bg-bg-secondary rounded-xl p-4">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Cliente</span>
              <span className="text-text-primary font-medium">{pedido.nombreCliente}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Teléfono</span>
              <span className="text-text-primary">{pedido.telefono}</span>
            </div>
            {pedido.email && (
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Email</span>
                <span className="text-text-primary">{pedido.email}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Estado pago</span>
              <span className="text-accent-secondary font-medium">{pedido.estadoPago}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Total</span>
              <span className="font-mono text-accent-primary font-bold">
                S/ {pedido.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Items</h3>
            {pedido.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-bg-secondary rounded-lg p-3">
                {item.imagenUrl ? (
                  <Image src={item.imagenUrl} alt={item.nombreProducto} width={48} height={48} className="rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-bg-elevated flex items-center justify-center text-xs text-text-muted">
                    ADN
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">{item.nombreProducto}</p>
                  <p className="text-xs text-text-muted">
                    Talla: {item.talla}{item.color ? ` · ${item.color}` : ""} x{item.cantidad}
                  </p>
                </div>
                <span className="font-mono text-sm text-text-primary">
                  S/ {(item.precioUnit * item.cantidad).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {pedido.comprobante && (
            <div>
              <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-2">Comprobante</h3>
              <Image src={pedido.comprobante} alt="Comprobante de pago" width={300} height={200} className="rounded-xl border border-border-subtle object-cover" />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm text-text-secondary">Notas internas</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              className="w-full bg-bg-input border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary resize-none"
              placeholder={pedido.estadoPago === "EN_REVISION" ? "Motivo si vas a rechazar..." : "Notas adicionales..."}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => handleAction("RECHAZAR")}
              loading={loading === "RECHAZAR"}
            >
              RECHAZAR PAGO
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleAction("CONFIRMAR")}
              loading={loading === "CONFIRMAR"}
            >
              CONFIRMAR PAGO
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
