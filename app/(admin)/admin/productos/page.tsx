import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { ProductosTableActions } from "@/components/admin/ProductosTableActions";

async function getProductos() {
  const productos = await prisma.producto.findMany({
    include: {
      categoria: { select: { nombre: true } },
      variantes: { select: { stock: true } },
      imagenes: { select: { url: true }, orderBy: { orden: "asc" } },
    },
    orderBy: { creadoEn: "desc" },
  });

  return productos.map((p) => ({
    ...p,
    precio: Number(p.precio),
    stockTotal: p.variantes.reduce((sum, v) => sum + v.stock, 0),
    imagenes: p.imagenes.map((i) => i.url),
  }));
}

export default async function AdminProductosPage() {
  const productos = await getProductos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-text-primary">Productos</h1>
          <p className="text-text-secondary text-sm mt-1">{productos.length} productos registrados</p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button>+ NUEVO PRODUCTO</Button>
        </Link>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Producto</th>
                <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Categoría</th>
                <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Precio</th>
                <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Stock</th>
                <th className="text-left p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Estado</th>
                <th className="text-right p-4 text-text-muted font-medium uppercase tracking-wider text-xs">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-bg-secondary shrink-0">
                        {producto.imagenes[0] ? (
                          <Image src={producto.imagenes[0]} alt="" fill className="object-cover" sizes="40px" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-text-muted text-xs font-display">U</div>
                        )}
                      </div>
                      <span className="text-text-primary font-medium truncate max-w-[200px]">
                        {producto.nombre}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary">{producto.categoria.nombre}</td>
                  <td className="p-4 font-mono text-text-primary">{formatPrice(producto.precio)}</td>
                  <td className="p-4">
                    <span className={`font-mono text-sm ${producto.stockTotal === 0 ? "text-accent-secondary" : "text-text-primary"}`}>
                      {producto.stockTotal}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant={producto.activo ? "nuevo" : "agotado"}>
                      {producto.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <ProductosTableActions productoId={producto.id} activo={producto.activo} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
