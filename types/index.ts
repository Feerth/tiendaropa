import type { EstadoPedido, EstadoPago } from "@prisma/client";

export type ImagenConColor = {
  url: string;
  colorKey: string | null;
};

export type ProductoListItem = {
  id: string;
  nombre: string;
  slug: string;
  precio: number;
  precioAntes: number | null;
  imagenes: ImagenConColor[];
  categoria: { nombre: string; slug: string };
  marca: { nombre: string; slug: string } | null;
  variantes: { talla: string; stock: number; color: string | null }[];
  destacado: boolean;
  activo: boolean;
  creadoEn: Date;
};

export type ProductoDetalle = ProductoListItem & {
  descripcion: string | null;
  variantes: {
    id: string;
    talla: string;
    color: string | null;
    stock: number;
    sku: string | null;
  }[];
  categoria: { id: string; nombre: string; slug: string };
  marca: { id: string; nombre: string; slug: string } | null;
  relacionados: ProductoListItem[];
};

export type ProductoFormData = {
  nombre: string;
  descripcion?: string;
  precio: number;
  precioAntes?: number;
  categoriaId: string;
  marcaId?: string;
  imagenes?: { url: string; colorKey: string | null }[];
  destacado?: boolean;
  activo?: boolean;
  variantes: {
    talla: string;
    color?: string;
    stock: number;
    sku?: string;
  }[];
};

export type CartItem = {
  varianteId: string;
  productoId: string;
  nombre: string;
  imagen: string;
  talla: string;
  color: string | null;
  precio: number;
  cantidad: number;
  stockDisponible: number;
};

export type PedidoListItem = {
  id: string;
  numero: number;
  nombreCliente: string;
  telefono: string;
  total: number;
  estado: EstadoPedido;
  estadoPago: EstadoPago;
  itemsCount: number;
  creadoEn: Date;
};

export type DashboardData = {
  totalProductos: number;
  productoSinStock: number;
  pedidosPendientes: number;
  pedidosPagoPendiente: number;
  pedidosHoy: number;
  ventasHoy: number;
  ultimosPedidos: PedidoListItem[];
  alertasStock: { nombre: string; productoId: string; variante: string; stock: number }[];
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
};
