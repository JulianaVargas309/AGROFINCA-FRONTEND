import { z } from "zod"

export const createCategoriaSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
})

export const updateCategoriaSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres").optional(),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  activo: z.boolean().optional(),
})

export type CreateCategoriaFormData = z.infer<typeof createCategoriaSchema>
export type UpdateCategoriaFormData = z.infer<typeof updateCategoriaSchema>
