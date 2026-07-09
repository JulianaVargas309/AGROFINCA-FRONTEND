import { z } from "zod"

export const createVentaSchema = z.object({
  fecha: z.string().min(1, "Seleccione una fecha"),
  cliente: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  tipoProducto: z.string().min(1, "Seleccione un tipo"),
  cantidad: z.coerce.number().positive("Debe ser positivo"),
  unidadMedida: z.string().min(1, "Seleccione unidad"),
  precioUnitario: z.coerce.number().positive("Debe ser positivo"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
})

export const updateVentaSchema = z.object({
  fecha: z.string().optional(),
  cliente: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres").optional(),
  tipoProducto: z.string().optional(),
  cantidad: z.coerce.number().positive("Debe ser positivo").optional(),
  unidadMedida: z.string().optional(),
  precioUnitario: z.coerce.number().positive("Debe ser positivo").optional(),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
})

export type CreateVentaFormData = z.infer<typeof createVentaSchema>
export type UpdateVentaFormData = z.infer<typeof updateVentaSchema>
