import { PedidoService } from "@/lib/services/pedido";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/utils";
import { Badge, type BadgeVariant } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";

const estadoColors: Record<string, BadgeVariant> = {
  PENDIENTE: "stockBajo",
  CONFIRMADO: "default",
  EN_PREPARACION: "nuevo",
  ENVIADO: "nuevo",
  ENTREGADO: "default",
  CANCELADO: "agotado",
};

export default async function AdminDashboardPage() {
  let data;
  try {
    data = await PedidoService.dashboard();
  } catch (e) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-accent-secondary/20 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF0055" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="font-display text-2xl text-text-primary">Error del sistema</h2>
          <p className="text-text-secondary text-sm break-all font-mono text-xs">
            {e instanceof Error ? e.message : String(e)}
          </p>
          <a
            href="/admin"
            className="inline-block px-6 py-3 bg-accent-primary text-black font-bold rounded-lg hover:brightness-110 transition-all font-display tracking-wider"
          >
            REINTENTAR
          </a>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Productos", value: data.totalProductos, href: "/admin/productos" },
    { label: "Sin stock", value: data.productoSinStock, href: "/admin/inventario", alert: data.productoSinStock > 0 },
    { label: "Pedidos pendientes", value: data.pedidosPendientes, href: "/admin/pedidos", alert: data.pedidosPendientes > 0 },
    { label: "Pagos pendientes", value: data.pedidosPagoPendiente, href: "/admin/pedidos", alert: data.pedidosPagoPendiente > 0 },
    { label: "Pedidos hoy", value: data.pedidosHoy, href: "/admin/pedidos" },
    { label: "Ventas hoy", value: formatPrice(data.ventasHoy), href: "/admin/pedidos" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-text-primary">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Resumen general de la tienda</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-bg-card border border-border-subtle rounded-xl p-5 hover:border-border-default hover:bg-bg-elevated transition-all"
          >
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider">{card.label}</p>
            <p className={`font-display text-4xl mt-1 ${card.alert ? "text-accent-secondary" : "text-accent-primary"}`}>
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-text-primary">ÚLTIMOS PEDIDOS</h2>
            <Link href="/admin/pedidos" className="text-xs text-accent-primary hover:underline">
              Ver todos
            </Link>
          </div>

          <div className="space-y-3">
            {data.ultimosPedidos.map((pedido) => (
              <div key={pedido.id} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                <div>
                  <p className="text-sm text-text-primary font-medium">#{pedido.numero}</p>
                  <p className="text-xs text-text-muted">{pedido.nombreCliente}</p>
                </div>
                <div className="text-right">
                  <Badge variant={estadoColors[pedido.estado] || "default"}>
                    {pedido.estado}
                  </Badge>
                  <p className="text-xs text-text-muted mt-1">{formatDate(pedido.creadoEn)}</p>
                </div>
              </div>
            ))}
            {data.ultimosPedidos.length === 0 && (
              <p className="text-sm text-text-muted text-center py-4">No hay pedidos aún</p>
            )}
          </div>
        </div>

        <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
          <h2 className="font-display text-xl text-text-primary mb-4">ALERTAS DE STOCK</h2>

          <div className="space-y-3">
            {data.alertasStock.length > 0 ? (
              data.alertasStock.map((alerta) => (
                <div key={alerta.productoId} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                  <div>
                    <p className="text-sm text-text-primary font-medium">{alerta.nombre}</p>
                    <p className="text-xs text-text-muted">{alerta.variante}</p>
                  </div>
                  <span className={`font-mono text-sm font-bold ${Number(alerta.stock) === 0 ? "text-accent-secondary" : "text-accent-tertiary"}`}>
                    {alerta.stock} uds
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-muted text-center py-4">Todo en stock ✅</p>
            )}
          </div>

          <Link href="/admin/inventario">
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              GESTIONAR INVENTARIO
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
