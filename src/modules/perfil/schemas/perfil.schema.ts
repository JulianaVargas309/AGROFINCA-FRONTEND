import { z } from "zod"
import { nombreValidator, documentoValidator, passwordValidator, phoneValidator } from "@/utils/validators"

export const perfilSchema = z.object({
  nombre: nombreValidator,
  documento: documentoValidator,
  correo: z.string().email("Correo inválido").optional().or(z.literal("")),
  telefono: phoneValidator,
})

export const changePasswordSchema = z
  .object({
    newPassword: passwordValidator,
    confirmPassword: z.string().min(1, "Confirma la nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type PerfilInput = z.infer<typeof perfilSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
