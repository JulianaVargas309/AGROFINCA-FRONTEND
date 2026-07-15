import { z } from "zod"

export const createActividadSchema = z.object({
  titulo: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  descripcion: z.string().max(1000, "Máximo 1000 caracteres").optional().or(z.literal("")),
  estado: z.enum(["PENDIENTE", "EN_PROCESO", "FINALIZADA", "CANCELADA"], { errorMap: () => ({ message: "Seleccione un estado" }) }),
  fechaInicio: z.string().optional().or(z.literal("")),
  fechaFin: z.string().optional().or(z.literal("")),
  tiempoInvertido: z.coerce.number().positive("Debe ser positivo").optional(),
  costo: z.coerce.number().positive("Debe ser positivo").optional(),
  responsableId: z.coerce.number().positive("Seleccione un responsable"),
  loteId: z.coerce.number().positive("Seleccione un lote").optional(),
  cultivoId: z.coerce.number().positive("Seleccione un cultivo").optional(),
  fincaId: z.coerce.number().positive("Seleccione una finca").optional(),
  evidencias: z.array(z.object({
    url: z.string().min(1, "URL requerida"),
    tipo: z.string().min(1, "Tipo requerido"),
    descripcion: z.string().optional().or(z.literal("")),
  })).optional(),
  productosUtilizados: z.array(z.object({
    cantidad: z.coerce.number().positive("Cantidad debe ser positiva"),
    productoId: z.coerce.number().positive("Seleccione un producto"),
  })).optional(),
})

export const updateActividadSchema = z.object({
  titulo: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres").optional(),
  descripcion: z.string().max(1000, "Máximo 1000 caracteres").optional().or(z.literal("")),
  estado: z.enum(["PENDIENTE", "EN_PROCESO", "FINALIZADA", "CANCELADA"]).optional(),
  fechaInicio: z.string().optional().or(z.literal("")),
  fechaFin: z.string().optional().or(z.literal("")),
  tiempoInvertido: z.coerce.number().positive("Debe ser positivo").optional(),
  costo: z.coerce.number().positive("Debe ser positivo").optional(),
  responsableId: z.coerce.number().positive().optional(),
  loteId: z.coerce.number().positive().optional(),
  cultivoId: z.coerce.number().positive().optional(),
  fincaId: z.coerce.number().positive().optional(),
})

export type CreateActividadFormData = z.infer<typeof createActividadSchema>
export type UpdateActividadFormData = z.infer<typeof updateActividadSchema>
