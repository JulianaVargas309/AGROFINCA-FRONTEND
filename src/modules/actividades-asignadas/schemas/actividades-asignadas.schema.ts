import { z } from "zod"

export const createActividadAsignadaSchema = z.object({
  titulo: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  estado: z.enum(["PENDIENTE", "EN_PROGRESO", "COMPLETADA", "CANCELADA"]).optional(),
  fechaAsignacion: z.string().optional().or(z.literal("")),
  fechaInicio: z.string().optional().or(z.literal("")),
  fechaFin: z.string().optional().or(z.literal("")),
  prioridad: z.enum(["BAJA", "MEDIA", "ALTA", "URGENTE"]).optional(),
  trabajadorId: z.coerce.number().positive("Seleccione un trabajador"),
  loteId: z.coerce.number().positive().optional(),
  cultivoId: z.coerce.number().positive().optional(),
})

export const updateActividadAsignadaSchema = z.object({
  titulo: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres").optional(),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  estado: z.enum(["PENDIENTE", "EN_PROGRESO", "COMPLETADA", "CANCELADA"]).optional(),
  fechaInicio: z.string().optional().or(z.literal("")),
  fechaFin: z.string().optional().or(z.literal("")),
  prioridad: z.enum(["BAJA", "MEDIA", "ALTA", "URGENTE"]).optional(),
  trabajadorId: z.coerce.number().positive().optional(),
  loteId: z.coerce.number().positive().optional(),
  cultivoId: z.coerce.number().positive().optional(),
})

export type CreateActividadFormData = z.infer<typeof createActividadAsignadaSchema>
export type UpdateActividadFormData = z.infer<typeof updateActividadAsignadaSchema>
