import { z } from "zod"
import { nombreValidator } from "@/utils/validators"

export const createRoleSchema = z.object({
  nombre: nombreValidator,
  descripcion: z.string().max(300).optional().or(z.literal("")),
  nivel: z.coerce.number().int().min(0).default(0),
  permissionIds: z.array(z.number().int().positive()).optional(),
})

export const updateRoleSchema = z.object({
  nombre: nombreValidator.optional(),
  descripcion: z.string().max(300).optional().or(z.literal("")),
  nivel: z.coerce.number().int().min(0).optional(),
  permissionIds: z.array(z.number().int().positive()).optional(),
})

export type CreateRoleFormData = z.infer<typeof createRoleSchema>
export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>
