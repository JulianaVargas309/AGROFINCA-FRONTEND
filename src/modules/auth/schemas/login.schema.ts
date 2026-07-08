import { z } from "zod"
import { documentoValidator, passwordValidator } from "@/utils/validators"

export const loginSchema = z.object({
  documento: documentoValidator,
  password: passwordValidator,
})

export type LoginInput = z.infer<typeof loginSchema>
