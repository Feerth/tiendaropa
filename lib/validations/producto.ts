import { z } from "zod";

export const varianteSchema = z.object({
  talla: z.string().min(1, "La talla es requerida"),
  color: z.string().optional(),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  sku: z.string().optional(),
});

export const createProductoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().optional(),
  precio: z.number().positive("El precio debe ser mayor a 0"),
  precioAntes: z.number().positive().optional(),
  categoriaId: z.string().min(1, "La categoría es requerida"),
  imagenes: z.array(z.string()).max(4).optional(),
  destacado: z.boolean().optional(),
  activo: z.boolean().optional(),
  variantes: z.array(varianteSchema).min(1, "Agrega al menos una variante"),
});

export const updateProductoSchema = createProductoSchema.partial();

export const stockUpdateSchema = z.object({
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
});

export const pedidoCreateSchema = z.object({
  nombreCliente: z.string().min(2, "El nombre es requerido"),
  telefono: z.string().min(7, "Teléfono inválido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        varianteId: z.string(),
        cantidad: z.number().int().positive(),
      })
    )
    .min(1, "Agrega al menos un producto"),
  notas: z.string().optional(),
});

export const pedidoUpdateSchema = z.object({
  estado: z.enum([
    "PENDIENTE",
    "CONFIRMADO",
    "EN_PREPARACION",
    "ENVIADO",
    "ENTREGADO",
    "CANCELADO",
  ]).optional(),
  estadoPago: z.enum([
    "PENDIENTE",
    "EN_REVISION",
    "CONFIRMADO",
    "RECHAZADO",
  ]).optional(),
  notas: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
});

export type CreateProductoInput = z.infer<typeof createProductoSchema>;
export type UpdateProductoInput = z.infer<typeof updateProductoSchema>;
export type StockUpdateInput = z.infer<typeof stockUpdateSchema>;
export type PedidoCreateInput = z.infer<typeof pedidoCreateSchema>;
export type PedidoUpdateInput = z.infer<typeof pedidoUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
