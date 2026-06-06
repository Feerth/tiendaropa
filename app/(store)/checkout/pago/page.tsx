"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { formatPrice } from "@/lib/utils";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51931869696";

function PagoContent() {
  const searchParams = useSearchParams();
  const numero = searchParams.get("numero");
  const id = searchParams.get("id");
  const total = searchParams.get("total");

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_NUMBER);
  const [copied, setCopied] = useState(false);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    fetch("/api/configuracion-publica")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          if (res.data.qr_imagen_url) setQrUrl(res.data.qr_imagen_url);
          if (res.data.whatsapp_numero) setWhatsappNumber(res.data.whatsapp_numero);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyMonto = async () => {
    try {
      await navigator.clipboard.writeText(total || "");
    } catch {
      const input = document.createElement("input");
      input.value = total || "";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `¡Hola! Ya realicé el pago del pedido #${numero} por S/ ${parseFloat(total || "0").toFixed(2)}. Por favor confírmalo.`
    );
    window.open(
      `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${message}`,
      "_blank"
    );

    if (id) {
      fetch(`/api/pedidos/${id}/notificar-pago`, {
        method: "PATCH",
      }).catch(() => {});
    }
    setNotified(true);
  };

  const totalNum = parseFloat(total || "0");

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 space-y-6">
        <div className="space-y-2">
          <div className="w-14 h-14 rounded-full bg-accent-primary/20 flex items-center justify-center mx-auto">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="font-display text-4xl text-text-primary">
            PEDIDO #{numero} CREADO
          </h1>
          <p className="text-text-secondary text-sm">
            Ahora realiza el pago para confirmarlo
          </p>
        </div>

        <div className="bg-bg-secondary rounded-xl p-6 space-y-4">
          {qrUrl ? (
            <div className="space-y-2">
              <div className="relative w-48 h-48 mx-auto rounded-xl overflow-hidden bg-white p-2">
                <Image
                  src={qrUrl}
                  alt="QR de pago"
                  width={200}
                  height={200}
                  className="object-contain w-full h-full"
                />
              </div>
              <p className="text-xs text-text-muted">
                Escanea con Yape o Plin
              </p>
            </div>
          ) : (
            <div className="py-6 space-y-2">
              <div className="w-48 h-48 mx-auto rounded-xl bg-bg-elevated flex items-center justify-center border-2 border-dashed border-border-default">
                <p className="text-xs text-text-muted text-center px-4">
                  QR no configurado
                  <br />
                  <span className="text-[10px]">Paga por WhatsApp directo</span>
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-wider">
              Monto a pagar
            </p>
            <p className="font-mono text-4xl text-accent-primary font-bold">
              {formatPrice(totalNum)}
            </p>
          </div>

          <p className="text-xs text-text-muted">
            Número de pedido: <span className="font-mono text-text-secondary">#{numero}</span>
          </p>
        </div>

        <Button variant="secondary" className="w-full" onClick={handleCopyMonto}>
          {copied ? "✓ COPIADO" : "📋 COPIAR MONTO"}
        </Button>

        <div className="border-t border-border-subtle pt-4 space-y-3">
          <Button
            size="lg"
            className="w-full"
            onClick={handleWhatsApp}
            disabled={notified}
          >
            {notified ? "✓ AVISADO — ESPERANDO CONFIRMACIÓN" : "✓ YA PAGUÉ — AVISAR POR WHATSAPP"}
          </Button>

          <p className="text-xs text-text-muted">
            Tu pedido será confirmado en máx. 2 horas hábiles.
          </p>
        </div>

        <Link
          href={`/pedido/${numero}`}
          className="block text-sm text-accent-primary hover:underline"
        >
          Ver estado de mi pedido →
        </Link>
      </div>
    </div>
  );
}

export default function PagoPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="animate-pulse text-text-muted">Cargando...</div>
      </div>
    }>
      <PagoContent />
    </Suspense>
  );
}
