import { z } from "zod"

export const createHistorialSchema = z.object({
  tipo: z.string().min(1, "Seleccione un tipo"),
  descripcion: z.string().min(2, "Mínimo 2 caracteres").max(500, "Máximo 500 caracteres"),
  fecha: z.string().optional().or(z.literal("")),
  observaciones: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  trabajadorId: z.coerce.number().positive("Seleccione un trabajador"),
})

export type CreateHistorialFormData = z.infer<typeof createHistorialSchema>
