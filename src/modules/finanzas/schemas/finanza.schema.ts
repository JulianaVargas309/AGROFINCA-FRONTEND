import { z } from "zod"

const CATEGORIAS_GASTO = ["INSUMOS", "MANO_DE_OBRA", "MANTENIMIENTO", "TRANSPORTE", "ADMINISTRACION", "OTRO"] as const

export const createGastoSchema = z.object({
  descripcion: z.string().min(2, "Mínimo 2 caracteres").max(500, "Máximo 500 caracteres"),
  monto: z.coerce.number().positive("Debe ser positivo"),
  categoria: z.enum(CATEGORIAS_GASTO).optional(),
  fecha: z.string().min(1, "Selecciona una fecha"),
  proveedorId: z.coerce.number().int().positive().optional(),
  cultivoId: z.coerce.number().int().positive().optional(),
  fincaId: z.coerce.number().int().positive().optional(),
  loteId: z.coerce.number().int().positive().optional(),
})

export const updateGastoSchema = z.object({
  descripcion: z.string().min(2).max(500).optional(),
  monto: z.coerce.number().positive().optional(),
  categoria: z.enum(CATEGORIAS_GASTO).optional(),
  fecha: z.string().min(1).optional(),
  proveedorId: z.coerce.number().int().positive().optional().nullable(),
  cultivoId: z.coerce.number().int().positive().optional().nullable(),
  fincaId: z.coerce.number().int().positive().optional().nullable(),
  loteId: z.coerce.number().int().positive().optional().nullable(),
})

export const createVentaSchema = z.object({
  clienteId: z.coerce.number().int().positive("Selecciona un cliente"),
  detalles: z
    .array(
      z.object({
        productoId: z.coerce.number().int().positive("Selecciona un producto"),
        cantidad: z.coerce.number().positive("Debe ser positivo"),
        precioUnitario: z.coerce.number().positive("Debe ser positivo"),
      }),
    )
    .min(1, "Agrega al menos un detalle"),
})

export const CATEGORIA_GASTO_OPTIONS = CATEGORIAS_GASTO.map((c) => ({
  value: c,
  label: c.charAt(0) + c.slice(1).toLowerCase().replace(/_/g, " "),
}))

export type CreateGastoFormData = z.infer<typeof createGastoSchema>
export type UpdateGastoFormData = z.infer<typeof updateGastoSchema>
export type CreateVentaFormData = z.infer<typeof createVentaSchema>
