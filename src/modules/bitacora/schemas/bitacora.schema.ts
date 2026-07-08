import { z } from "zod"

const ACTIVIDADES = ["FERTILIZACION", "FUMIGACION", "PODA", "DESHIERBE", "COSECHA", "SIEMBRA", "MANTENIMIENTO", "OTRO"] as const

export const createBitacoraSchema = z.object({
  fecha: z.string().min(1, "Selecciona una fecha"),
  actividad: z.enum(ACTIVIDADES, { message: "Selecciona una actividad" }),
  descripcion: z.string().min(2, "Mínimo 2 caracteres").max(1000, "Máximo 1000 caracteres"),
  cantidad: z.coerce.number().positive("Debe ser positivo").optional(),
  unidadMedida: z.string().max(20).optional().or(z.literal("")),
  costo: z.coerce.number().min(0, "No puede ser negativo").default(0),
  observaciones: z.string().max(1000).optional().or(z.literal("")),
  loteId: z.coerce.number().int().positive("Selecciona un lote"),
  cultivoId: z.coerce.number().int().positive().optional(),
  productoId: z.coerce.number().int().positive().optional(),
})

export const updateBitacoraSchema = z.object({
  fecha: z.string().min(1).optional(),
  actividad: z.enum(ACTIVIDADES).optional(),
  descripcion: z.string().min(2).max(1000).optional(),
  cantidad: z.coerce.number().positive().optional(),
  unidadMedida: z.string().max(20).optional().or(z.literal("")),
  costo: z.coerce.number().min(0).optional(),
  observaciones: z.string().max(1000).optional().or(z.literal("")),
  cultivoId: z.coerce.number().int().positive().optional(),
  productoId: z.coerce.number().int().positive().optional(),
})

export type CreateBitacoraFormData = z.infer<typeof createBitacoraSchema>
export type UpdateBitacoraFormData = z.infer<typeof updateBitacoraSchema>

export const ACTIVIDAD_OPTIONS = ACTIVIDADES.map((a) => ({
  value: a,
  label: a.charAt(0) + a.slice(1).toLowerCase().replace(/_/g, " "),
}))
