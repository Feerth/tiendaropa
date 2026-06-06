import { z } from "zod";

export const varianteSchema = z.object({
  talla: z.string().min(1, "La talla es requerida"),
  color: z.string().optional(),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  sku: z.string().optional(),
});

export const imagenFormSchema = z.object({
  url: z.string().url("Debe ser una URL válida"),
  colorKey: z.string().nullable(),
});

const productoSchemaBase = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  descripcion: z.string().max(2000).optional(),
  precio: z.number().positive("El precio debe ser mayor a 0"),
  precioAntes: z.number().positive().optional(),
  categoriaId: z.string().min(1, "La categoría es requerida"),
  marcaId: z.string().optional(),
  imagenes: z.array(imagenFormSchema).max(12).optional(),
  destacado: z.boolean().optional(),
  activo: z.boolean().optional(),
  variantes: z.array(varianteSchema).min(1, "Agrega al menos una variante"),
});

export const createProductoSchema = productoSchemaBase.refine(
  (data) => !data.precioAntes || data.precioAntes > data.precio,
  { message: "El precio anterior debe ser mayor al precio actual", path: ["precioAntes"] }
);

export const updateProductoSchema = productoSchemaBase.partial();

export const stockUpdateSchema = z.object({
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
});

export type CreateProductoInput = z.infer<typeof createProductoSchema>;
export type UpdateProductoInput = z.infer<typeof updateProductoSchema>;
export type StockUpdateInput = z.infer<typeof stockUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
