import { z } from "zod"

export const createRendimientoLoteSchema = z.object({
  temporada: z.string().optional().or(z.literal("")),
  areaCultivada: z.coerce.number().positive("Debe ser positivo").optional(),
  produccionTotal: z.coerce.number().positive("Debe ser un número positivo"),
  unidad: z.string().optional().or(z.literal("")),
  observaciones: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  loteId: z.coerce.number().positive("Seleccione un lote"),
})

export const createRendimientoCultivoSchema = z.object({
  temporada: z.string().optional().or(z.literal("")),
  areaCultivada: z.coerce.number().positive("Debe ser positivo").optional(),
  produccionTotal: z.coerce.number().positive("Debe ser un número positivo"),
  unidad: z.string().optional().or(z.literal("")),
  observaciones: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  cultivoId: z.coerce.number().positive("Seleccione un cultivo"),
})

export type CreateRendimientoLoteFormData = z.infer<typeof createRendimientoLoteSchema>
export type CreateRendimientoCultivoFormData = z.infer<typeof createRendimientoCultivoSchema>
