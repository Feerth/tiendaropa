import { z } from "zod";

export const checkoutSchema = z.object({
  nombreCliente: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es muy largo"),
  telefono: z
    .string()
    .min(9, "El teléfono debe tener al menos 9 dígitos")
    .max(15, "Teléfono inválido")
    .regex(/^[0-9]+$/, "Solo se permiten números"),
  email: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  direccion: z
    .string()
    .max(200, "La dirección es muy larga")
    .optional()
    .or(z.literal("")),
  notas: z
    .string()
    .max(500, "Las notas son muy largas")
    .optional()
    .or(z.literal("")),
  items: z
    .array(
      z.object({
        varianteId: z.string().min(1, "ID de variante requerido"),
        cantidad: z.number().int().positive("La cantidad debe ser positiva"),
      })
    )
    .min(1, "Agrega al menos un producto"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const pedidoCreateSchema = z.object({
  nombreCliente: z.string().min(2, "El nombre es requerido"),
  telefono: z.string().min(7, "Teléfono inválido").regex(/^[0-9+]+$/, "Solo números y +"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        varianteId: z.string(),
        cantidad: z.number().int().positive(),
      })
    )
    .min(1, "Agrega al menos un producto"),
  notas: z.string().max(500).optional(),
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

export type PedidoCreateInput = z.infer<typeof pedidoCreateSchema>;
export type PedidoUpdateInput = z.infer<typeof pedidoUpdateSchema>;
