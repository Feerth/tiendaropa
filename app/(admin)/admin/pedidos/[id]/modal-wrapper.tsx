"use client";

import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { PaymentConfirmModal } from "@/components/admin/PaymentConfirmModal";

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

export function PaymentConfirmModalWrapper({ pedido }: { pedido: PedidoData }) {
  const [open, setOpen] = useState(false);

  if (pedido.estadoPago !== "EN_REVISION") return null;

  return (
    <>
      <Button onClick={() => setOpen(true)} size="lg" className="w-full">
        REVISAR PAGO — EN REVISIÓN
      </Button>
      {open && (
        <PaymentConfirmModal pedido={pedido} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
