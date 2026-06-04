import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/shared/Badge";
import { OrderTimeline } from "@/components/store/OrderTimeline";
import Link from "next/link";

interface Props {
  params: Promise<{ numero: string }>;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51931869696";

export default async function PedidoStatusPage({ params }: Props) {
  const { numero } = await params;

  const pedido = await prisma.pedido.findUnique({
    where: { numero: parseInt(numero) },
    include: { items: true },
  });

  if (!pedido) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-5xl text-text-primary">
          PEDIDO #{pedido.numero}
        </h1>
        <p className="text-text-secondary text-sm">
          Creado el {formatDate(pedido.creadoEn)}
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8">
        <OrderTimeline estadoActual={pedido.estado} estadoPago={pedido.estadoPago} />
      </div>

      {/* Info cliente */}
      <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 space-y-3">
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">
          Datos del cliente
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-text-muted">Nombre</span>
            <p className="text-text-primary font-medium">{pedido.nombreCliente}</p>
          </div>
          <div>
            <span className="text-text-muted">Teléfono</span>
            <p className="text-text-primary">{pedido.telefono}</p>
          </div>
          {pedido.email && (
            <div>
              <span className="text-text-muted">Email</span>
              <p className="text-text-primary">{pedido.email}</p>
            </div>
          )}
          {pedido.direccion && (
            <div className="col-span-2">
              <span className="text-text-muted">Dirección</span>
              <p className="text-text-primary">{pedido.direccion}</p>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border-subtle">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">
            Items ({pedido.items.length})
          </h3>
        </div>
        <div className="divide-y divide-border-subtle">
          {pedido.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-bg-secondary shrink-0">
                {item.imagenUrl ? (
                  <Image src={item.imagenUrl} alt={item.nombreProducto} fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-text-muted font-display">
                    ADN
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary font-medium truncate">
                  {item.nombreProducto}
                </p>
                <p className="text-xs text-text-muted">
                  Talla: {item.talla}{item.color ? ` · ${item.color}` : ""} x{item.cantidad}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-text-primary">
                  {formatPrice(Number(item.precioUnit))}
                </p>
                <p className="text-xs text-text-muted">c/u</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 border-t border-border-subtle flex items-center justify-between">
          <span className="text-text-muted text-sm">Total</span>
          <span className="font-mono text-2xl text-accent-primary font-bold">
            {formatPrice(Number(pedido.total))}
          </span>
        </div>
      </div>

      {/* Notas */}
      {pedido.notas && (
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
            Notas
          </h3>
          <p className="text-sm text-text-secondary">{pedido.notas}</p>
        </div>
      )}

      {/* WhatsApp */}
      <div className="text-center">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hola, tengo una consulta sobre mi pedido #${pedido.numero}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 border border-border-default rounded-xl text-sm text-text-secondary hover:bg-bg-elevated transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Contactar por WhatsApp si tienes dudas
        </a>
      </div>

      {/* Back to store */}
      <div className="text-center">
        <Link href="/productos" className="text-sm text-accent-primary hover:underline">
          ← Seguir comprando
        </Link>
      </div>
    </div>
  );
}
