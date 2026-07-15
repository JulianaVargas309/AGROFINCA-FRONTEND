import { z } from "zod"

export const detalleCompraSchema = z.object({
  productoId: z.coerce.number().positive("Seleccione un producto"),
  cantidad: z.coerce.number().positive("Debe ser positiva"),
  precioUnitario: z.coerce.number().positive("Debe ser positivo"),
})

export const createCompraSchema = z.object({
  numeroFactura: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
  fecha: z.string().optional().or(z.literal("")),
  proveedorId: z.coerce.number().positive("Seleccione un proveedor").optional(),
  detalles: z.array(detalleCompraSchema).min(1, "Agregue al menos un detalle"),
  observaciones: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
})

export type CreateCompraFormData = z.infer<typeof createCompraSchema>
