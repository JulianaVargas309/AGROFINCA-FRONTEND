import { z } from "zod"

export const createGastoSchema = z.object({
  fecha: z.string().min(1, "Seleccione una fecha"),
  categoria: z.string().min(1, "Seleccione una categoría"),
  descripcion: z.string().min(2, "Mínimo 2 caracteres").max(500, "Máximo 500 caracteres"),
  monto: z.coerce.number().positive("Debe ser positivo"),
  proveedor: z.string().max(200, "Máximo 200 caracteres").optional().or(z.literal("")),
  comprobante: z.string().max(200, "Máximo 200 caracteres").optional().or(z.literal("")),
  loteId: z.coerce.number().positive().optional(),
})

export const updateGastoSchema = z.object({
  fecha: z.string().optional(),
  categoria: z.string().optional(),
  descripcion: z.string().min(2, "Mínimo 2 caracteres").max(500, "Máximo 500 caracteres").optional(),
  monto: z.coerce.number().positive("Debe ser positivo").optional(),
  proveedor: z.string().max(200, "Máximo 200 caracteres").optional().or(z.literal("")),
  comprobante: z.string().max(200, "Máximo 200 caracteres").optional().or(z.literal("")),
  loteId: z.coerce.number().positive().optional(),
})

export type CreateGastoFormData = z.infer<typeof createGastoSchema>
export type UpdateGastoFormData = z.infer<typeof updateGastoSchema>
