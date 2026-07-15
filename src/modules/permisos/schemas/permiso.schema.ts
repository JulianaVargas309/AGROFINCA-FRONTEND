import { z } from "zod"
import { nombreValidator } from "@/utils/validators"

export const createPermisoSchema = z.object({
  nombre: nombreValidator,
  descripcion: z.string().max(300).optional().or(z.literal("")),
  modulo: z.string().max(100).optional().or(z.literal("")),
})

export const updatePermisoSchema = z.object({
  nombre: nombreValidator.optional(),
  descripcion: z.string().max(300).optional().or(z.literal("")),
  modulo: z.string().max(100).optional().or(z.literal("")),
})

export type CreatePermisoFormData = z.infer<typeof createPermisoSchema>
export type UpdatePermisoFormData = z.infer<typeof updatePermisoSchema>
