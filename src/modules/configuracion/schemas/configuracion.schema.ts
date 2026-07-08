import { z } from "zod"

export const configuracionSchema = z.object({
  tema: z.enum(["claro", "oscuro"]).default("claro"),
  idioma: z.string().default("es"),
  notificaciones: z.boolean().default(true),
})

export type ConfiguracionInput = z.infer<typeof configuracionSchema>
