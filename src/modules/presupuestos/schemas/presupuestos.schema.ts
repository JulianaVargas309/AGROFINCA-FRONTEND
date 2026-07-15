import { z } from "zod"

export const partidaSchema = z.object({
  concepto: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  montoPrevisto: z.coerce.number().positive("Debe ser positivo"),
  categoria: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
})

export const createPresupuestoSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  periodoInicio: z.string().min(1, "Seleccione una fecha"),
  periodoFin: z.string().min(1, "Seleccione una fecha"),
  fincaId: z.coerce.number().positive().optional().or(z.literal(0)),
  partidas: z.array(partidaSchema).min(1, "Agregue al menos una partida"),
})

export type CreatePresupuestoFormData = z.infer<typeof createPresupuestoSchema>
export interface PresupuestoFormData extends Omit<CreatePresupuestoFormData, "partidas"> {
  partidas: { concepto: string; montoPrevisto: number; categoria?: string }[]
}
