import { z } from "zod"

export const notificacionFilterSchema = z.object({
  leida: z.boolean().optional(),
  tipo: z.string().optional(),
})

export type NotificacionFilterFormData = z.infer<typeof notificacionFilterSchema>
