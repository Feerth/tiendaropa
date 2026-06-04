"use client";

interface Props {
  estadoActual: string;
  estadoPago: string;
}

const steps = [
  { key: "PENDIENTE", label: "Pendiente" },
  { key: "CONFIRMADO", label: "Confirmado" },
  { key: "EN_PREPARACION", label: "Preparando" },
  { key: "ENVIADO", label: "Enviado" },
  { key: "ENTREGADO", label: "Entregado" },
];

export function OrderTimeline({ estadoActual, estadoPago }: Props) {
  const currentIndex = steps.findIndex((s) => s.key === estadoActual);
  const isCancelled = estadoActual === "CANCELADO";
  const isPaymentPending = estadoPago === "PENDIENTE";
  const isPaymentReview = estadoPago === "EN_REVISION";
  const isPaymentConfirmed = estadoPago === "CONFIRMADO";
  const isPaymentRejected = estadoPago === "RECHAZADO";

  return (
    <div className="space-y-4">
      {/* Payment status indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-xs text-text-muted uppercase tracking-wider">Pago:</span>
        {isPaymentConfirmed ? (
          <span className="text-xs font-medium text-accent-success">✓ CONFIRMADO</span>
        ) : isPaymentRejected ? (
          <span className="text-xs font-medium text-accent-secondary">✗ RECHAZADO</span>
        ) : isPaymentReview ? (
          <span className="text-xs font-medium text-accent-secondary animate-pulse">⏳ EN REVISIÓN</span>
        ) : (
          <span className="text-xs font-medium text-text-muted">⏳ PENDIENTE</span>
        )}
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {steps.map((step, index) => {
          const isActive = index <= currentIndex && !isCancelled;
          const isCurrent = index === currentIndex && !isCancelled;

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-500 ${
                    isCancelled
                      ? "bg-accent-secondary/20 text-accent-secondary"
                      : isActive
                        ? "bg-accent-primary text-black shadow-glow"
                        : "bg-bg-elevated border border-border-default text-text-muted"
                  } ${isCurrent ? "ring-2 ring-accent-primary ring-offset-2 ring-offset-bg-primary scale-110" : ""}`}
                >
                  {isCancelled && index === 0 ? "✗" : isActive ? "✓" : index + 1}
                </div>
                <span
                  className={`text-[10px] sm:text-xs mt-1.5 whitespace-nowrap ${
                    isCancelled
                      ? "text-accent-secondary"
                      : isActive
                        ? "text-text-primary font-medium"
                        : "text-text-muted"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-6 sm:w-12 md:w-20 mx-1 sm:mx-2 rounded-full ${
                    isCancelled
                      ? "bg-accent-secondary/30"
                      : index < currentIndex
                        ? "bg-accent-primary"
                        : "bg-border-default"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {isCancelled && (
        <p className="text-center text-sm text-accent-secondary mt-4">
          Este pedido fue cancelado
        </p>
      )}
    </div>
  );
}
