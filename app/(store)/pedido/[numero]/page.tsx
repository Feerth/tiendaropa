import type { Metadata } from "next";
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

const INSTAGRAM_USERNAME = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || "nov4sk_";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { numero } = await params;
  return {
    title: `Pedido #${numero} — NOVASK`,
    description: `Estado del pedido #${numero} en NOVASK. Consulta el estado de tu pedido de zapatillas.`,
  };
}

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

      {/* Instagram */}
      <div className="text-center">
        <a
          href={`https://ig.me/m/${INSTAGRAM_USERNAME.replace(/^@/, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 border border-border-default rounded-xl text-sm text-text-secondary hover:bg-bg-elevated transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          Contactar por Instagram si tienes dudas
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
