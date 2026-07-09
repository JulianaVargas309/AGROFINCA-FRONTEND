import { z } from "zod"

export const createTrabajadorSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  documento: z.string().min(5, "Mínimo 5 caracteres").max(50, "Máximo 50 caracteres"),
  telefono: z.string().max(20, "Máximo 20 caracteres").optional().or(z.literal("")),
  direccion: z.string().max(300, "Máximo 300 caracteres").optional().or(z.literal("")),
  cargo: z.string().min(1, "Seleccione un cargo"),
  fechaIngreso: z.string().min(1, "Seleccione una fecha"),
})

export const updateTrabajadorSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres").optional(),
  documento: z.string().min(5, "Mínimo 5 caracteres").max(50, "Máximo 50 caracteres").optional(),
  telefono: z.string().max(20, "Máximo 20 caracteres").optional().or(z.literal("")),
  direccion: z.string().max(300, "Máximo 300 caracteres").optional().or(z.literal("")),
  cargo: z.string().optional(),
  fechaIngreso: z.string().optional(),
  activo: z.boolean().optional(),
})

export type CreateTrabajadorFormData = z.infer<typeof createTrabajadorSchema>
export type UpdateTrabajadorFormData = z.infer<typeof updateTrabajadorSchema>
