import { z } from "zod"
import { documentoValidator } from "@/utils/validators"

export const registerSchema = z.object({
  documento: documentoValidator,
  rol: z.enum(["ADMIN", "FAMILIAR", "CONSULTA"]).default("FAMILIAR"),
})

export type RegisterInput = z.infer<typeof registerSchema>
