import { z } from "zod"

export const createFlujoSchema = z.object({
  tipo: z.string().min(1, "Seleccione un tipo"),
  categoria: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
  monto: z.coerce.number().positive("Debe ser un monto positivo"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  fecha: z.string().min(1, "Seleccione una fecha"),
})

export type CreateFlujoFormData = z.infer<typeof createFlujoSchema>
