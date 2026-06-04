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
