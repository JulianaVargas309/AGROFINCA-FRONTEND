import { z } from "zod"
import { documentoValidator, phoneValidator } from "@/utils/validators"

export const registerSchema = z.object({
  documento: documentoValidator,
  correo: z.string().email("Correo inválido").optional().or(z.literal("")),
  telefono: phoneValidator,
  rol: z.enum(["ADMIN", "FAMILIAR", "CONSULTA"]).default("FAMILIAR"),
})

export type RegisterInput = z.infer<typeof registerSchema>
