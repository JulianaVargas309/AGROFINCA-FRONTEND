import { z } from "zod"

export const createAjusteSchema = z.object({
  tipo: z.enum(["entrada", "salida"], { required_error: "Seleccione un tipo" }),
  cantidad: z.coerce.number().positive("Debe ser positiva"),
  motivo: z.string().min(2, "Mínimo 2 caracteres").max(500, "Máximo 500 caracteres"),
  productoId: z.coerce.number().positive("Seleccione un producto"),
})

export type CreateAjusteFormData = z.infer<typeof createAjusteSchema>
