import { z } from "zod"

export const createAsistenciaSchema = z.object({
  fecha: z.string().min(1, "Seleccione una fecha"),
  horaEntrada: z.string().optional().or(z.literal("")),
  horaSalida: z.string().optional().or(z.literal("")),
  presente: z.boolean().optional(),
  justificacion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  trabajadorId: z.coerce.number().positive("Seleccione un trabajador"),
})

export type CreateAsistenciaFormData = z.infer<typeof createAsistenciaSchema>
