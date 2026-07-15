import { z } from "zod"
import { nombreValidator, documentoValidator, phoneValidator } from "@/utils/validators"

export const createTrabajadorSchema = z.object({
  nombre: nombreValidator,
  apellido: z.string().max(100).optional().or(z.literal("")),
  documento: documentoValidator,
  telefono: phoneValidator,
  direccion: z.string().max(300).optional().or(z.literal("")),
  cargo: z.string().min(1, "Seleccione un cargo"),
  fechaIngreso: z.string().min(1, "Seleccione una fecha"),
  salario: z.coerce.number().min(0).optional(),
  observaciones: z.string().max(500).optional().or(z.literal("")),
})

export const updateTrabajadorSchema = z.object({
  nombre: nombreValidator.optional(),
  apellido: z.string().max(100).optional().or(z.literal("")),
  documento: documentoValidator.optional(),
  telefono: phoneValidator,
  direccion: z.string().max(300).optional().or(z.literal("")),
  cargo: z.string().optional(),
  fechaIngreso: z.string().optional(),
  activo: z.boolean().optional(),
  salario: z.coerce.number().min(0).optional(),
  observaciones: z.string().max(500).optional().or(z.literal("")),
})

export type CreateTrabajadorFormData = z.infer<typeof createTrabajadorSchema>
export type UpdateTrabajadorFormData = z.infer<typeof updateTrabajadorSchema>
