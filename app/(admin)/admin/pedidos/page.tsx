import { prisma } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/shared/Badge";
import type { BadgeVariant } from "@/components/shared/Badge";
import { PedidosTableActions } from "@/components/admin/PedidosTableActions";
import Link from "next/link";

const estadoVariants: Record<string, BadgeVariant> = {
  PENDIENTE: "stockBajo",
  CONFIRMADO: "default",
  EN_PREPARACION: "nuevo",
  ENVIADO: "nuevo",
  ENTREGADO: "default",
  CANCELADO: "agotado",
};

export default async function PedidosPage() {
  const pedidos = await prisma.pedido.findMany({
    include: { items: true },
    orderBy: { creadoEn: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-text-primary">Pedidos</h1>
        <p className="text-text-secondary text-sm mt-1">{pedidos.length} pedidos registrados</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">N°</th>
                <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Cliente</th>
                <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Teléfono</th>
                <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Items</th>
                <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Total</th>
                <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Estado</th>
                <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Pago</th>
                <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Fecha</th>
                <th className="text-right p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                  <td className="p-4">
                    <Link href={`/admin/pedidos/${pedido.id}`} className="font-mono text-accent-primary hover:underline">
                      #{pedido.numero}
                    </Link>
                  </td>
                  <td className="p-4 text-text-primary font-medium">{pedido.nombreCliente}</td>
                  <td className="p-4 text-text-secondary">{pedido.telefono}</td>
                  <td className="p-4 text-text-secondary">{pedido.items.length}</td>
                  <td className="p-4 font-mono text-accent-primary font-bold">{formatPrice(Number(pedido.total))}</td>
                  <td className="p-4">
                    <Badge variant={estadoVariants[pedido.estado] || "default"}>
                      {pedido.estado}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {pedido.estadoPago === "EN_REVISION" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-accent-secondary font-medium animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary" />
                        EN REVISIÓN
                      </span>
                    ) : (
                      <span className={`text-xs font-medium ${
                        pedido.estadoPago === "CONFIRMADO" ? "text-accent-tertiary" :
                        pedido.estadoPago === "RECHAZADO" ? "text-accent-secondary" :
                        "text-text-muted"
                      }`}>
                        {pedido.estadoPago}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-text-muted text-xs">{formatDate(pedido.creadoEn)}</td>
                  <td className="p-4 text-right">
                    <PedidosTableActions pedidoId={pedido.id} estadoActual={pedido.estado} />
                  </td>
                </tr>
              ))}
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-text-muted">
                    No hay pedidos aún
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
