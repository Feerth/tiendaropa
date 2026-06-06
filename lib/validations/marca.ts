import { z } from "zod";

export const createMarcaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  imagenUrl: z.string().url().optional().or(z.literal("")),
});

export const updateMarcaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  imagenUrl: z.string().url().optional().or(z.literal("")),
});

export type CreateMarcaInput = z.infer<typeof createMarcaSchema>;
export type UpdateMarcaInput = z.infer<typeof updateMarcaSchema>;
