import { z } from "zod"

export const createJornalSchema = z.object({
  fecha: z.string().min(1, "Seleccione una fecha"),
  horas: z.coerce.number().positive("Debe ser positivo").max(24, "Máximo 24 horas"),
  valorHora: z.coerce.number().positive("Debe ser positivo"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  trabajadorId: z.coerce.number().positive("Seleccione un trabajador"),
  loteId: z.coerce.number().positive().optional(),
})

export const updateJornalSchema = z.object({
  fecha: z.string().optional(),
  horas: z.coerce.number().positive("Debe ser positivo").max(24, "Máximo 24 horas").optional(),
  valorHora: z.coerce.number().positive("Debe ser positivo").optional(),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  trabajadorId: z.coerce.number().positive().optional(),
  loteId: z.coerce.number().positive().optional(),
})

export type CreateJornalFormData = z.infer<typeof createJornalSchema>
export type UpdateJornalFormData = z.infer<typeof updateJornalSchema>
