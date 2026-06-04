import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/shared/Badge";
import Image from "next/image";
import Link from "next/link";
import { PaymentConfirmModalWrapper } from "./modal-wrapper";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PedidoDetailPage({ params }: Props) {
  const { id } = await params;

  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!pedido) notFound();

  const estadoBadgeVariant: Record<string, "nuevo" | "stockBajo" | "agotado" | "default"> = {
    PENDIENTE: "stockBajo",
    CONFIRMADO: "default",
    EN_PREPARACION: "nuevo",
    ENVIADO: "nuevo",
    ENTREGADO: "default",
    CANCELADO: "agotado",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/pedidos" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
            ← Volver a pedidos
          </Link>
          <h1 className="font-display text-3xl text-text-primary mt-1">
            Pedido #{pedido.numero}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={estadoBadgeVariant[pedido.estado] || "default"}>
            {pedido.estado}
          </Badge>
          <Badge variant={pedido.estadoPago === "CONFIRMADO" ? "default" : pedido.estadoPago === "RECHAZADO" ? "agotado" : "stockBajo"}>
            PAGO: {pedido.estadoPago}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-bg-card border border-border-subtle rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">Datos del cliente</h3>
          <p className="text-text-primary font-medium">{pedido.nombreCliente}</p>
          <p className="text-text-secondary text-sm">{pedido.telefono}</p>
          {pedido.email && <p className="text-text-muted text-sm">{pedido.email}</p>}
          {pedido.direccion && (
            <p className="text-text-muted text-sm">
              📍 {pedido.direccion}
            </p>
          )}
        </div>

        <div className="bg-bg-card border border-border-subtle rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">Resumen</h3>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Items</span>
            <span className="text-text-primary">{pedido.items.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Total</span>
            <span className="font-mono text-accent-primary font-bold">
              {formatPrice(Number(pedido.total))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Fecha</span>
            <span className="text-text-muted text-xs">{formatDate(pedido.creadoEn)}</span>
          </div>
          {pedido.confirmadoEn && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Confirmado</span>
              <span className="text-accent-tertiary text-xs">{formatDate(pedido.confirmadoEn)}</span>
            </div>
          )}
        </div>
      </div>

      {pedido.notas && (
        <div className="bg-bg-card border border-border-subtle rounded-xl p-5">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Notas del cliente</h3>
          <p className="text-text-secondary text-sm">{pedido.notas}</p>
        </div>
      )}

      {pedido.notasAdmin && (
        <div className="bg-bg-card border border-border-subtle rounded-xl p-5">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Notas internas</h3>
          <p className="text-text-secondary text-sm whitespace-pre-line">{pedido.notasAdmin}</p>
        </div>
      )}

      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border-subtle">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">Items del pedido</h3>
        </div>
        <div className="divide-y divide-border-subtle">
          {pedido.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              {item.imagenUrl ? (
                <Image src={item.imagenUrl} alt={item.nombreProducto} width={56} height={56} className="rounded-lg object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-bg-elevated flex items-center justify-center text-xs text-text-muted">
                  ADN
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary font-medium truncate">{item.nombreProducto}</p>
                <p className="text-xs text-text-muted">
                  Talla: {item.talla}{item.color ? ` · ${item.color}` : ""}
                  {item.sku ? ` · SKU: ${item.sku}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-text-primary">
                  {formatPrice(Number(item.precioUnit))}
                </p>
                <p className="text-xs text-text-muted">x{item.cantidad}</p>
              </div>
              <p className="font-mono text-sm text-accent-primary font-bold w-20 text-right">
                {formatPrice(Number(item.precioUnit) * item.cantidad)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {pedido.comprobante && (
        <div className="bg-bg-card border border-border-subtle rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">Comprobante de pago</h3>
          <Image
            src={pedido.comprobante}
            alt="Comprobante"
            width={400}
            height={300}
            className="rounded-xl border border-border-subtle object-cover"
          />
        </div>
      )}

      <PaymentConfirmModalWrapper pedido={JSON.parse(JSON.stringify(pedido))} />
    </div>
  );
}
