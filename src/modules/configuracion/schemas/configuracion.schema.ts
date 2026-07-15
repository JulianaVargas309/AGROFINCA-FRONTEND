import { z } from "zod"

export const configuracionSchema = z.object({
  valor: z.string().min(1, "El valor es requerido"),
  descripcion: z.string().optional().or(z.literal("")),
})

export type ConfiguracionInput = z.infer<typeof configuracionSchema>
