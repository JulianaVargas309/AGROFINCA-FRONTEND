import { z } from "zod"

export const createFincaSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(200, "Máximo 200 caracteres"),
  ubicacion: z.string().max(300, "Máximo 300 caracteres").optional().or(z.literal("")),
  hectareas: z.coerce.number().positive("Debe ser un número positivo").optional(),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
})

export const updateFincaSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres").optional(),
  ubicacion: z.string().max(300, "Máximo 300 caracteres").optional().or(z.literal("")),
  hectareas: z.coerce.number().positive("Debe ser un número positivo").optional().or(z.literal(0)),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
})

export type CreateFincaFormData = z.infer<typeof createFincaSchema>
export type UpdateFincaFormData = z.infer<typeof updateFincaSchema>
