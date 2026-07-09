import { z } from "zod"

export const createMovimientoSchema = z.object({
  tipo: z.string().min(1, "Seleccione un tipo"),
  cantidad: z.coerce.number().positive("Debe ser positivo"),
  unidadMedida: z.string().min(1, "Seleccione unidad"),
  fecha: z.string().min(1, "Seleccione una fecha"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  productoId: z.coerce.number().positive("Seleccione un producto"),
  loteId: z.coerce.number().positive().optional(),
})

export const updateMovimientoSchema = z.object({
  tipo: z.string().optional(),
  cantidad: z.coerce.number().positive("Debe ser positivo").optional(),
  unidadMedida: z.string().optional(),
  fecha: z.string().optional(),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  productoId: z.coerce.number().positive().optional(),
  loteId: z.coerce.number().positive().optional(),
})

export type CreateMovimientoFormData = z.infer<typeof createMovimientoSchema>
export type UpdateMovimientoFormData = z.infer<typeof updateMovimientoSchema>
