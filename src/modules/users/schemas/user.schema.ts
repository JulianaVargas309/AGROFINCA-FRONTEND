import { z } from "zod"
import { nombreValidator, documentoValidator, passwordValidator, phoneValidator } from "@/utils/validators"

export const createUserSchema = z.object({
  nombre: nombreValidator,
  apellido: z.string().max(100).optional().or(z.literal("")),
  documento: documentoValidator,
  correo: z.string().email("Correo inválido").optional().or(z.literal("")),
  telefono: phoneValidator,
  password: passwordValidator,
  rol: z.string().min(1, "Seleccione un rol"),
})

export const updateUserSchema = z.object({
  nombre: nombreValidator.optional(),
  apellido: z.string().max(100).optional().or(z.literal("")),
  correo: z.string().email("Correo inválido").optional().or(z.literal("")),
  telefono: phoneValidator,
  roleId: z.number().int().positive().nullable().optional(),
  activo: z.boolean().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Ingrese su contraseña actual"),
  newPassword: passwordValidator,
  confirmPassword: z.string().min(1, "Confirme la nueva contraseña"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export const changeRolSchema = z.object({
  rol: z.string().min(1, "Seleccione un rol"),
  roleId: z.number().int().positive().optional(),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type ChangeRolFormData = z.infer<typeof changeRolSchema>
