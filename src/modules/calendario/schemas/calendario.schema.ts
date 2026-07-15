import { z } from "zod"

export const createEventoSchema = z.object({
  titulo: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  tipo: z.enum(["SIEMBRA", "FERTILIZACION", "RIEGO", "FUMIGACION", "PODA", "COSECHA", "COMPRA", "PAGO", "JORNAL", "MANTENIMIENTO", "OTRO"], { errorMap: () => ({ message: "Seleccione un tipo" }) }),
  fechaInicio: z.string().min(1, "Seleccione una fecha de inicio"),
  fechaFin: z.string().optional().or(z.literal("")),
  todoElDia: z.boolean().default(false),
  estado: z.string().min(1, "Seleccione un estado"),
  prioridad: z.enum(["BAJA", "MEDIA", "ALTA", "CRITICA"], { errorMap: () => ({ message: "Seleccione una prioridad" }) }),
  color: z.string().optional().or(z.literal("")),
  ubicacion: z.string().max(200, "Máximo 200 caracteres").optional().or(z.literal("")),
  fincaId: z.coerce.number().positive("Seleccione una finca").optional(),
  loteId: z.coerce.number().positive("Seleccione un lote").optional(),
  cultivoId: z.coerce.number().positive("Seleccione un cultivo").optional(),
})

export const updateEventoSchema = z.object({
  titulo: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres").optional(),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  tipo: z.enum(["SIEMBRA", "FERTILIZACION", "RIEGO", "FUMIGACION", "PODA", "COSECHA", "COMPRA", "PAGO", "JORNAL", "MANTENIMIENTO", "OTRO"]).optional(),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional().or(z.literal("")),
  todoElDia: z.boolean().optional(),
  estado: z.string().optional(),
  prioridad: z.enum(["BAJA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  color: z.string().optional().or(z.literal("")),
  ubicacion: z.string().max(200, "Máximo 200 caracteres").optional().or(z.literal("")),
  fincaId: z.coerce.number().positive().optional(),
  loteId: z.coerce.number().positive().optional(),
  cultivoId: z.coerce.number().positive().optional(),
})

export const createRecordatorioSchema = z.object({
  titulo: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  mensaje: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  fecha: z.string().min(1, "Seleccione una fecha"),
  eventoCalendarioId: z.coerce.number().positive().optional(),
})

export type CreateEventoFormData = z.infer<typeof createEventoSchema>
export type UpdateEventoFormData = z.infer<typeof updateEventoSchema>
export type CreateRecordatorioFormData = z.infer<typeof createRecordatorioSchema>
