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
  correo: z.string().email("Correo inválido").optional().or(z.literal("")),
  fechaNacimiento: z.string().optional().or(z.literal("")),
  eps: z.string().max(100).optional().or(z.literal("")),
  arl: z.string().max(100).optional().or(z.literal("")),
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
  correo: z.string().email("Correo inválido").optional().or(z.literal("")),
  fechaNacimiento: z.string().optional().or(z.literal("")),
  eps: z.string().max(100).optional().or(z.literal("")),
  arl: z.string().max(100).optional().or(z.literal("")),
  salario: z.coerce.number().min(0).optional(),
  observaciones: z.string().max(500).optional().or(z.literal("")),
})

export type CreateTrabajadorFormData = z.infer<typeof createTrabajadorSchema>
export type UpdateTrabajadorFormData = z.infer<typeof updateTrabajadorSchema>
