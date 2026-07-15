import { z } from "zod"

export const createTemporadaSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  fechaInicio: z.string().min(1, "Seleccione una fecha de inicio"),
  fechaFin: z.string().optional().or(z.literal("")),
  fincaId: z.coerce.number().positive("Seleccione una finca"),
})

export const updateTemporadaSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres").optional(),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional().or(z.literal("")),
  activo: z.boolean().optional(),
  fincaId: z.coerce.number().positive().optional(),
})

export type CreateTemporadaFormData = z.infer<typeof createTemporadaSchema>
export type UpdateTemporadaFormData = z.infer<typeof updateTemporadaSchema>
