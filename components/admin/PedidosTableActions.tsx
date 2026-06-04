"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { useToastStore } from "@/stores/toast";

interface Props {
  pedidoId: string;
  estadoActual: string;
}

const estados = [
  "PENDIENTE",
  "CONFIRMADO",
  "EN_PREPARACION",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

export function PedidosTableActions({ pedidoId, estadoActual }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const handleChangeEstado = async (nuevoEstado: string) => {
    if (nuevoEstado === "CANCELADO" && !confirm("¿Cancelar este pedido? Esta acción no se puede deshacer.")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/pedidos/${pedidoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      const result = await res.json();
      if (!result.success) {
        addToast(result.error, "error");
        return;
      }

      addToast("Estado actualizado", "success");
      router.refresh();
    } catch {
      addToast("Error al actualizar estado", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={estadoActual}
      onChange={(e) => handleChangeEstado(e.target.value)}
      disabled={loading}
      className="text-xs bg-bg-secondary border border-border-default rounded px-2 py-1 text-text-primary focus:outline-none focus:border-accent-primary"
    >
      {estados.map((estado) => (
        <option key={estado} value={estado}>
          {estado}
        </option>
      ))}
    </select>
  );
}
