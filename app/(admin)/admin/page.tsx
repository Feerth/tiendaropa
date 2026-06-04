import { PedidoService } from "@/lib/services/pedido";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
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
  const data = await PedidoService.dashboard();

  const cards = [
    { label: "Productos", value: data.totalProductos, href: "/admin/productos" },
    { label: "Sin stock", value: data.productoSinStock, href: "/admin/inventario", alert: data.productoSinStock > 0 },
    { label: "Pedidos pendientes", value: data.pedidosPendientes, href: "/admin/pedidos", alert: data.pedidosPendientes > 0 },
    { label: "Pedidos hoy", value: data.pedidosHoy, href: "/admin/pedidos" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-text-primary">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Resumen general de la tienda</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div key={alerta.nombre} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                  <div>
                    <p className="text-sm text-text-primary font-medium">{alerta.nombre.split("|")[0]}</p>
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
