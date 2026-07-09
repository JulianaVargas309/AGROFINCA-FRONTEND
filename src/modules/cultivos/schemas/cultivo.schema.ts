import { z } from "zod"

export const createCultivoSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  tipo: z.string().min(1, "Seleccione un tipo"),
  variedad: z.string().max(200, "Máximo 200 caracteres").optional().or(z.literal("")),
  fechaSiembra: z.string().optional().or(z.literal("")),
  areaSembrada: z.coerce.number().positive("Debe ser positivo").optional(),
  estado: z.string().min(1, "Seleccione un estado"),
  loteId: z.coerce.number().positive("Seleccione un lote"),
  fincaId: z.coerce.number().positive("Seleccione una finca"),
})

export const updateCultivoSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres").optional(),
  tipo: z.string().optional(),
  variedad: z.string().max(200, "Máximo 200 caracteres").optional().or(z.literal("")),
  fechaSiembra: z.string().optional().or(z.literal("")),
  areaSembrada: z.coerce.number().positive("Debe ser positivo").optional(),
  estado: z.string().optional(),
  loteId: z.coerce.number().positive().optional(),
  fincaId: z.coerce.number().positive().optional(),
})

export type CreateCultivoFormData = z.infer<typeof createCultivoSchema>
export type UpdateCultivoFormData = z.infer<typeof updateCultivoSchema>
