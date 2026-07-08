import { z } from "zod"

export const createLoteSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  area: z.coerce.number().positive("Debe ser positivo").optional(),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  fincaId: z.coerce.number().int().positive("Selecciona una finca"),
})

export const updateLoteSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres").optional(),
  area: z.coerce.number().positive("Debe ser positivo").optional().or(z.literal(0)),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
})

export type CreateLoteFormData = z.infer<typeof createLoteSchema>
export type UpdateLoteFormData = z.infer<typeof updateLoteSchema>
