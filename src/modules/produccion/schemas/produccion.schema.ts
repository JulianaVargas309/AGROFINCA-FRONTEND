import { z } from "zod"

export const createProduccionSchema = z.object({
  fecha: z.string().min(1, "Seleccione una fecha"),
  cantidad: z.coerce.number().positive("Debe ser un número positivo"),
  unidad: z.string().optional().or(z.literal("")),
  calidad: z.string().optional().or(z.literal("")),
  destino: z.string().optional().or(z.literal("")),
  observaciones: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  temporadaId: z.coerce.number().positive("Seleccione una temporada"),
  cultivoId: z.coerce.number().positive("Seleccione un cultivo"),
  loteId: z.coerce.number().positive("Seleccione un lote"),
})

export const updateProduccionSchema = z.object({
  fecha: z.string().optional(),
  cantidad: z.coerce.number().positive("Debe ser un número positivo").optional(),
  unidad: z.string().optional().or(z.literal("")),
  calidad: z.string().optional().or(z.literal("")),
  destino: z.string().optional().or(z.literal("")),
  observaciones: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  temporadaId: z.coerce.number().positive().optional(),
  cultivoId: z.coerce.number().positive().optional(),
  loteId: z.coerce.number().positive().optional(),
})

export type CreateProduccionFormData = z.infer<typeof createProduccionSchema>
export type UpdateProduccionFormData = z.infer<typeof updateProduccionSchema>
