import { z } from "zod"

export const createProductoSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  categoria: z.string().max(100).optional().or(z.literal("")),
  unidadMedida: z.string().max(50).default("unidad"),
  stockActual: z.coerce.number().min(0, "No puede ser negativo").default(0),
  stockMinimo: z.coerce.number().min(0).default(0),
  precioUnitario: z.coerce.number().positive("Debe ser positivo").optional(),
})

export const updateProductoSchema = z.object({
  nombre: z.string().min(2).max(200).optional(),
  descripcion: z.string().max(500).optional().or(z.literal("")),
  categoria: z.string().max(100).optional().or(z.literal("")),
  unidadMedida: z.string().max(50).optional(),
  stockActual: z.coerce.number().min(0).optional(),
  stockMinimo: z.coerce.number().min(0).optional(),
  precioUnitario: z.coerce.number().positive().optional(),
})

export const createMovimientoSchema = z.object({
  tipo: z.enum(["entrada", "salida"], { message: "Selecciona un tipo" }),
  cantidad: z.coerce.number().positive("Debe ser positivo"),
  motivo: z.string().max(300).optional().or(z.literal("")),
  productoId: z.coerce.number().int().positive(),
})

export type CreateProductoFormData = z.infer<typeof createProductoSchema>
export type UpdateProductoFormData = z.infer<typeof updateProductoSchema>
export type CreateMovimientoFormData = z.infer<typeof createMovimientoSchema>
